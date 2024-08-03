import math
import re
import random

import collections

from typing import Callable

# from .contrib.spellcheck.correction import correction as text_correction
try:
    import nltk
except:
    USE_NLTK = False
else:
    USE_NLTK = True


class Pattern:
    def __init__(*_, **__):
        raise NotImplementedError()


class Evaluator(Pattern):
    def __init__(self, func):
        self.__func__ = func

    def check(self, node: "Node"):
        val, var = self.__func__(node)
        return (
            val,
            {
                "callback_pattern_evaluator": self,
            },
            var,
        )


class RegEx(Pattern):
    """
    Provides the base for regex pattern matching
    """

    def __init__(
        self: Pattern,
        regex: str | list[tuple[float | int, str]],
        score: int | float = 100.0,
    ):
        """
        Initializes a new Regular expression as Pattern
        :param regex: the regex
        which will be used to match
        """
        if isinstance(regex, str):
            pattern = re.compile(regex)
            self.regexs = [(score, pattern)]
        else:
            scores, res = zip(*regexs)
            res = map(re.compile, res)
            self.regexs = tuple(zip(res, scores))

    def check(self: "RegEx", node: "Node") -> tuple[int | float, dict, dict]:
        """
        Compares all the RegEx's stored on initialization to the string
        and if matching, returns the score and match object associated

        :param txt: The string to test
        :returns: A tuple (score, match Object)
        """
        ms = []
        for id, (score, regex) in enumerate(self.regexs):
            if m := regex.search(node.query):
                ms.append(
                    (
                        score,
                        {
                            "callback_pattern_regex_id": id,
                        },
                        {
                            "match": m,
                        },
                    )
                )
        if len(ms) > 0:
            ms.sort(key=lambda m: m[0], reverse=True)
            return ms[0]
        else:
            return [(0, {}, {})]


class Expression(Pattern):
    """
    Expression class to create a new expression, in the form

    """

    ENTRIES: dict[str, list[tuple]] = {}

    @classmethod
    def register(
        cls,
        name: str,
        vals: list[tuple[float | int, str]],
    ) -> None:
        """
        Registers a new expression
        :param name: The name under which to register the expression
        :param vals: a list of tuples in the form (score, regex)
        """
        cls.ENTRIES[name] = [(score, re.compile(txt)) for score, txt in vals]

    @staticmethod
    def parse(
        string: str,
    ) -> tuple[str | re.Pattern, int | float, tuple | re.Pattern]:
        """
        Expression.parses the passed Expression into tuples of (call, args)
        :param string: The string to Expression.parse

        :returns: The Expression.parsed expression tuple
        """
        global indent
        name = ""
        has_args = True
        i = 0
        while i < len(string):
            c = string[i]
            if c.isalnum() or c == ":":
                name += c
                i += 1
            else:
                break
        else:
            has_args = False
        if ":" in name:
            name, score = name.rsplit(":", 1)
            score = int(score)
        else:
            score = 100
        if not has_args:
            return (name, score, ())
        i, string = 0, string[i + 1 :]
        args = []
        while i < len(string):
            c = string[i]
            if c == ")":
                break
            elif c == '"':  # A string argument
                sargs = []
                nin = 0
                i += 1
                regex = ""
                while i < len(string):  # collecting string
                    if string[i] == "(":
                        nin += 1
                    elif string[i] == ")":
                        nin -= 1
                    if nin == 0 and string[i] == '"':  # end of string
                        if len(string) > i + 1 and string[i + 1] == ":":
                            # then it is followed by score
                            i += 2  # skip score
                            sscore = ""
                            while i < len(string) and string[i].isnumeric():
                                # next score digit
                                sscore += string[i]
                                i += 1
                            sscore = int(sscore)
                        else:
                            sscore = 100  # no score in expr
                            i += 1
                        if string[i] == "(":
                            scall = ""  # store whole call here
                            snin = 0
                            while i < len(string):
                                if snin == 0 and string[i] == ")":
                                    i += 1
                                    break
                                if string[i] == "(":
                                    snin += 1
                                elif string[i] == ")":
                                    snin -= 1
                                scall += string[i]
                                i += 1
                            sargs = Expression.parse("a" + scall)[2]
                            while i < len(string) and string[i] in ", ":
                                i += 1
                        break
                    else:
                        regex += string[i]
                        i += 1
                args.append((re.compile(regex), sscore, tuple(sargs)))
            elif c.isalpha():  # other call
                call = ""  # store whole call here
                nin = 0
                while i < len(string):
                    if nin == 0 and string[i] == ")":
                        i += 1
                        break
                    if string[i] == "(":
                        nin += 1
                    elif string[i] == ")":
                        nin -= 1
                    call += string[i]
                    i += 1
                args.append(Expression.parse(call))
                while i < len(string) and string[i] in ", ":
                    i += 1
        i -= 1
        return (name, score, tuple(args))

    @classmethod
    def _check(
        cls,
        name: str | re.Pattern,
        nscore,
        params: tuple[tuple | re.Pattern],
        string: str,
    ) -> tuple[int | float, dict, dict[str, str]]:
        tests = []
        if isinstance(name, str):
            try:
                regexs = cls.ENTRIES[name]
            except KeyError:
                raise ValueError(f"Expression {name!r} does not exist")
        elif isinstance(name, re.Pattern):
            regexs = [(100, name)]
        for id, (score, regex) in enumerate(regexs):
            vars = {}
            mat = regex.search(string)
            if not mat:
                continue
            args = mat.groups()
            args = args[: len(params)]
            if len(params) != len(args):
                continue
            match_score = 0
            for param, arg in zip(params, args):
                if isinstance(param, tuple):
                    paramname, paramscore, paramargs = param
                    vars[str(paramname)] = arg
                    pscore, _, pvars = Expression._check(
                        paramname,
                        paramscore,
                        paramargs,
                        arg,
                    )
                    for k, v in pvars.items():
                        vars[paramname + "." + k] = v
                    if pscore == -1:
                        continue
                    else:
                        match_score += pscore / 100 * score
                elif isinstance(param, re.Pattern):
                    if param.search(arg):
                        match_score += 100
                    else:
                        return -1, {}, {}
                else:
                    raise Exception()
            if len(params) == 0:
                match_score = 100
            tests.append(
                (
                    match_score / 100 * nscore,
                    {
                        "sub_pattern_id": id,
                    },
                    vars,
                )
            )

        if len(tests) == 0:
            return (-1, {}, {})
        else:
            tests.sort(key=lambda k: k[0], reverse=True)
            return tests[0]

    def __init__(self, expr: str):
        self.expr = Expression.parse(expr)

    def check(self, node: "Node"):
        return Expression._check(*self.expr, node.query)


class Callback:
    __func__: Callable
    patterns: list[tuple[int | float, Pattern]]

    def __init__(self, pattern: Pattern):
        if isinstance(pattern, list):
            self.patterns = pattern
        else:
            self.patterns = [(100, pattern)]

    def __call__(self, func: Callable) -> "Callback":
        self.__func__ = func
        if hasattr(func, "overload"):
            self.overload = func.overload
        return self

    def __set_name__(self, obj, name: str) -> None:
        obj.register(self)
        self.topic = obj

    def __get__(self, obj: "Topic") -> "Callback":
        return self

    def respond(self, node: "Node") -> None:
        if not hasattr(self, "__func__"):
            raise RuntimeError("Callable not decorated")
        self.__func__(node)

    def check(self, node: "Node") -> "list[tuple[int | float, dict, dict]]":
        matches = []
        for cpid, (pscore, pattern) in enumerate(self.patterns):
            score, param, var = pattern.check(node)
            if score >= 0:
                matches.append(
                    (
                        score / 100 * pscore,
                        param
                        | {
                            "callback_pattern_id": cpid,
                            "callback_pattern": (pscore, pattern),
                        },
                        var,
                    )
                )
        return matches


class Topic:
    _callbacks: list[Callback]
    name: str = None

    @classmethod
    def register(cls, callback: Callback) -> None:
        if not hasattr(cls, "_callbacks"):
            cls._callbacks = []
        cls._callbacks.append(callback)

    @classmethod
    def matches(cls, node: "Node") -> "list[tuple[float | int, dict, dict]]":
        matches = []
        for callback in cls._callbacks:
            for score, params, var in callback.check(node):
                matches.append(
                    (
                        score,
                        params
                        | {
                            "callback": callback,
                            "topic": cls,
                        },
                        var,
                    )
                )
        return matches

    @classmethod
    def respond(cls, node: "Node"):
        node.params["callback"].respond(node)


def use_nltk(val: bool = None) -> bool:
    global USE_NLTK
    if val is None:
        return USE_NLTK
    USE_NLTK = val
    if val:
        import nltk

        nltk.download("punkt")
        nltk.download("wordnet")
        nltk.download("stopwords")
    return val


Token = list[str]


class QA(Topic):
    jaccard_score = 0.5
    cosine_score = 1.5
    difflib_score = 1

    @staticmethod
    def tokenize(text: str) -> Token:
        if use_nltk():
            from nltk.corpus import stopwords
            from nltk.stem import WordNetLemmatizer
            from nltk.tokenize import word_tokenize

            tokens = word_tokenize(text.lower())
            stop_words = set(stopwords.words("english"))
            tokens = [t for t in tokens if t not in stop_words]  # junk
            lemmatizer = WordNetLemmatizer()
            tokens = [lemmatizer.lemmatize(t) for t in tokens]  # singular
            return tokens
        else:
            return text.split(" ")

    def jaccard_similarity(a: Token, b: Token) -> float:
        intersection = set(a) & set(b)
        union = set(a) | set(b)
        return len(intersection) / len(union) * 100

    def cosine_similarity(a: Token, b: Token) -> float:
        a = list(collections.Counter(a).values())
        b = list(collections.Counter(b).values())
        dot_product = sum(av * bv for av, bv in zip(a, b))
        magnitude_a = math.sqrt(sum(av**2 for av in a))
        magnitude_b = math.sqrt(sum(bv**2 for bv in b))
        return dot_product / (magnitude_a * magnitude_b) * 100

    def difflib_similarity(a: Token, b: Token) -> float:
        import difflib

        return (
            difflib.SequenceMatcher(
                lambda x: x == " -._",
                " ".join(a),
                " ".join(b),
            ).ratio()
            * 100
        )

    def levenshtein_distance(a: Token, b: Token) -> int:
        m, n = len(a), len(b)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                cost = 0 if a[i - 1] == b[j - 1] else 1
                dp[i][j] = min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j - 1] + cost,
                )
        return dp[m][n]

    @staticmethod
    def similarity(a: Token, b: Token) -> float:
        if isinstance(a, str):
            a = QA.tokenize(a)
        if isinstance(b, str):
            b = QA.tokenize(b)
        if use_nltk():
            return sum(
                (
                    QA.jaccard_similarity(a, b) * QA.jaccard_score,
                    QA.cosine_similarity(a, b) * QA.cosine_score,
                    QA.difflib_similarity(a, b) * QA.difflib_score,
                )
            ) / sum((QA.jaccard_score, QA.cosine_score, QA.difflib_score))
        else:
            return QA.difflib_similarity(a, b)

    class QA:
        questions: list[float, str]
        answers: list[str]
        tokens: list[tuple[int | float, list[str]]]

        def check(self, node: "Node") -> list[tuple[int | float, dict, dict]]:
            matches = []
            qtoken = QA.tokenize(node.query)
            for id, (score, question, token) in enumerate(self.questions):
                matches.append(
                    (
                        QA.similarity(qtoken, token) / 100 * score,
                        {
                            "qa_qa_question_id": id,
                            "qa_qa": self,
                            "qa_qa_question_question": question,
                        },
                        {
                            "question": question,
                        },
                    )
                )
            return matches

        def respond(self, node: "Node"):
            node.response = random.choice(self.answers)

        def __init__(self, questions: list[str], answers: list[str]):
            self.questions = []
            self.answers = answers
            for question in questions:
                if isinstance(question, tuple):
                    score, question = question
                else:
                    score = 100
                self.questions.append((score, question, QA.tokenize(question)))

    questions: list[int]

    @classmethod
    def matches(cls, node: "Node") -> list[tuple[int | float, dict, dict]]:
        matches = []
        for qa in cls.QAs:
            for score, param, var in qa.check(node):
                matches.append(
                    (
                        score,
                        param
                        | {
                            "qa": cls,
                            "topic": cls,
                        },
                        var,
                    )
                )
        return matches

    def __init_subclass__(cls):
        if hasattr(cls, "QAs"):
            return
        else:
            cls.QAs = []
        if hasattr(cls, "data"):
            data = cls.data
        elif hasattr(cls, "source_json"):
            import json

            with open(cls.source_json) as f:
                data = json.loads(f.read())
        elif hasattr(cls, "source_yaml"):
            import yaml

            with open(cls.source_yaml) as f:
                data = yaml.safe_load(f.read())
        else:
            data = []
        for questions, answers in data:
            cls.QAs.append(QA.QA(questions, answers))

    @classmethod
    def respond(cls, node: "Node"):
        node.params["qa_qa"].respond(node)
        cls.format_answer(node)

    @staticmethod
    def format_answer(cls, node: "Node"):
        pass


class Node:
    __slots__ = (
        "topics",
        "parent",
        "response",
        "query",
        "score",
        "vars",
        "params",
        "raw_query",
    )

    parent: "Node | type(None)"
    response: str
    query: str
    score: int | float
    vars: dict
    params: dict

    def __init__(
        self,
        query: str,
        raw_query: str,
        topics=(),
        parent: "Node | type(None)" = None,
        response: str = None,
    ):
        self.topics = topics
        self.parent = parent
        if response is not None:
            self.response = response
        self.query = query
        self.raw_query = raw_query

    def __str__(self):
        return f"<djamado.Node({self.query!r}) -> {self.response!r}>"


class Djamago:
    topics: dict[str, Topic]
    nodes: list[Node]
    name: str
    initial_node: Node

    def __init_subclass__(cls):
        cls.topics = {}

    def __init__(self, name: str = "", initial_node=None):
        self.name = name
        self.nodes = [
            initial_node
            or Node(
                topics=tuple(self.topics.keys()),
                parent=None,
                query="",
                raw_query="",
                response="",
            )
        ]

    def respond(self, query: str) -> Node:
        node = Node(
            parent=self.nodes[-1],
            raw_query=query,
            query=query.lower(),
        )
        self.respond_node(node)
        self.nodes.append(node)
        return node

    def respond_node(self, node: Node) -> None:
        matches = []
        for topic in node.parent.topics:
            if isinstance(topic, tuple):
                score, topic = topic
            else:
                score = 100
            matches.extend(
                [
                    (sscore / 100 * score, param, var)
                    for (sscore, param, var) in self.topics.get(topic).matches(
                        node
                    )
                ]
            )
        matches.sort(key=lambda m: m[0], reverse=True)
        if len(matches) == 0:
            raise ValueError("Node did not find any match")
        score, param, var = matches[0]
        node.params = param
        node.vars = var
        node.score = score
        param["topic"].respond(node)

    @classmethod
    def topic(cls, topic: type):
        name = topic.name or topic.__name__.lower()
        cls.topics[name] = topic


__version__ = "0.0.1"

###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################

question = lambda re: (
    rf"(?:.*(?:please|question.?)? ?{re}\??)" rf"|(?:may )?i ask you {re}\??"
)

Expression.register(
    "R",
    [
        (100, r"(.*)"),
    ],
)
Expression.register(
    "whois",
    [
        (100, r"(?:who is) (.*)"),
        (30, r"(?:do you know) (.*)"),
    ],
)
Expression.register(
    "whatis",
    [
        (100, r"(?:what is) (.*)"),
        (50, r"(?:tell me.? ?(?:djamago)? what is) (.*)"),
    ],
)
Expression.register(
    "greetings",
    [
        (100, r"hello"),
        (100, r"good (?:morning|evening|night|after-?noon)"),
        (70, r"greetings"),
        (20, r"good day"),
    ],
)
Expression.register(
    "callyou",
    [
        (100, question(r"how do you call yourself")),
        (100, rf"(?:tell me.? ?(?:djamago)? what is) (.*)"),
        (100, question(r"what is your name")),
        (100, question(r"how can I call you")),
    ],
)
Expression.register(
    "askingMyname",
    [
        (
            100,
            question(
                r"(?:how can (?:i|we) call you|what is your name|who are you|"
                r"how (?:do you|can you|are)? (?:call you|called))"
            ),
        ),
    ],
)
Expression.register(
    "username",
    [
        (
            100,
            question(r"(?:do you (?:know|remember))?(?: ?what is)? ?my name"),
        ),
    ],
)
Expression.register(
    "whoMadeMe",
    [
        (100, question(r"who (?:created|programmed|made|coded|trained) you")),
    ],
)
Expression.register(
    "name",
    [
        (100, r"[\w\d_\- \@]+"),
    ],
)

Expression.register(
    "aboutAUser",
    [
        (
            50,
            question(
                r"(?:do you know(?: about)?|who is|tell me about"
                r"|are you familiar with) ([\w\-_]+)"
            ),
        )
    ],
)


###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################

# import faqs
import json


def quote(txt):
    fl, *lns = txt.splitlines()
    ret = "> " + fl
    for ln in lns:
        ret += "\n  " + ln
    return ret


class Faq(QA):
    data = json.loads(open("/static/faqs.json").read())

    def format_answer(node):
        node.response = (
            f"#***Faq:** `{node.score:05.2f}%`:* `\n"
            f"##{node.params['qa_qa_question_question']}`:\n\n"
            f"{node.response}"
        )
        node.topics = ((100, "faq"), (100, "main"), (100, "markdown"))


###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################

import difflib
import random


class Main(Topic):
    """@Callback([
        (100, Evaluator(lambda node: (10, {})))
    ])
    def here(node, id, var):
        node.topics = (
            (100, 'main'),
        )
        node.response = random.choice([
            "You used an Evaluator"
        ])"""

    @Callback([(100, Expression("askingMyname"))])
    def call_me(node):
        node.topics = (
            # (100, 'pango'),
            (70, "main"),
        )
        node.response = random.choice(["Hy, I am pango"])

    @Callback([(100, Expression("whoMadeMe"))])
    def whomademe(node):
        node.topics = (
            (100, "markdown"),
            (70, "main"),
        )
        node.response = random.choice(
            [
                (
                    "I am trained by you, and your queries,"
                    " but I was programmed by @ken-morel;"
                ),
            ]
        )

    @Callback([(100, Expression("greetings"))])
    def greetings(node):
        node.topics = (
            (100, "main"),
            (100, "faq"),
        )
        node.response = random.choice(
            ["Yeah, how are you?", "Good day!", "Greetings"]
        )

    @Callback([(100, Expression("username"))])
    def user_name(node):
        node.topics = (
            (100, "main"),
            (70, "faq"),
        )
        node.response = random.choice(
            [
                (
                    "I am pango, but you... I don not know,"
                    " don not tell me, I won't remember it yet"
                )
            ]
        )

    @Callback([(100, Expression("aboutAUser(name)"))])
    def aboutAUser(node):
        users = []
        name = node.vars["name"]
        for user in sbook.accounts.User.all():
            r = max(
                difflib.SequenceMatcher(
                    lambda x: x == " -._",
                    name,
                    user.model.name,
                ).ratio(),
                difflib.SequenceMatcher(
                    lambda x: x == " -._",
                    name,
                    user.model.username,
                ).ratio(),
            )
            if r > 0.5 and (len(users) == 0 or r > users[-1][0]):
                users.append((r, user))
                users.sort(key=lambda u: u[0], reverse=True)
            if r > 0.9:
                users = [(r, user)]
                break
        if len(users) == 0:
            node.response = (
                f"**Sorry** I cannot find {name}," " are you sure so exists?"
            )
        elif len(users) == 1 or users[0][0] - 0.2 > users[1][0]:
            user = users[0][1]
            node.response = (
                f"Yeah you mean @{user.model.username};, his bio says:\n\n"
                + quote(user.model.bio)
            )
        node.topics = ((100, "main"), (100, "faq"))


###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################


class Markdown(Topic):
    @Callback(
        [
            (100, Expression(r'whatis(".*markdown.*")')),
        ]
    )
    def whatis(node, id, var):
        node.topics = (
            (100, "markdown"),
            (50, "main"),
        )
        node.response = random.choice([note_doc])

    @Callback(
        [
            (100, Expression(r'R:70(".*(?:markdown|\btip\b).*")')),
        ]
    )
    def tip(node, id, var):
        node.topics = (
            (100, "markdown"),
            (50, "main"),
        )
        node.response = random.choice(note_tips)


note_doc = """\
Here is an example of markdown code for a documentation that guides users on
using the markdown syntax in Note:

**Markdown Syntax**
--------------------

### Headers

To create a header, use the `#` symbol followed by the header text.

```
# Heading 1
## Heading 2
### Heading 3
```

### Bold and Italic Text

To create bold text, surround the text with `**` symbols.

```
**This text will be bold**
```

To create italic text, surround the text with `*` symbols.

```
*This text will be italic*
```

### Lists

To create an unordered list, use the `*` symbol followed by the list item.

```
* Item 1
* Item 2
* Item 3
```

To create an ordered list, use the `1.` symbol followed by the list item.

```
1. Item 1
2. Item 2
3. Item 3
```

### Mentions

To mention another user, use the `@` symbol followed by the username.

```
@johnDoe
```

This will create a link to the user's profile.

### Example Usage

Here is an example of how you can use the markdown syntax in Note:

```
# Welcome to Note!

This is an **example** of a note that mentions another user.

I would like to thank @johnDoe for his contribution to this project.

Here is a list of items:

* Item 1
* Item 2 @janeDoe
* Item 3

Best,
@antimonyTeam
```

This documentation will be updated regularly to include more features and
examples of the markdown syntax in Note. If you have any questions or need
further assistance, please don't hesitate to ask.

**Happy Writing!**
"""


note_tips = [
    "#Tip\nUse `*` to quote italic texts\ne.g `*hello*` -> *hello*",
    "#Tip\nUse `**` to quote bold texts\ne.g `**hello**` -> **hello**",
    "#Tip\nAdd images with `![image replacement](image url)`",
    "#Tip\nMention users with `@user:{username}` syntax",
]


###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
###############################################################################
class Pango(Djamago):
    INSTANCES = {}

    @classmethod
    def from_username(cls, name: str) -> "Pango":
        if name not in cls.INSTANCES:
            cls.INSTANCES[name] = Pango(name)
        return cls.INSTANCES[name]

    def __init__(self, name):
        super().__init__(
            "pango",
            Node(
                parent=None,
                query="",
                raw_query="",
                response="",
                topics=(
                    (100, "faq"),
                    (70, "main"),
                ),
            ),
        )
        self.username = name


def query(username: str, query: str) -> str:
    conv = Pango.from_username(username)
    try:
        open("pango/conversations.log", "a").write(
            username + "\n" + pango.quote(query) + "\n",
        )
    except Exception:
        pass

    return conv.respond(query).response


Pango.topic(Main)
Pango.topic(Markdown)
Pango.topic(Faq)
