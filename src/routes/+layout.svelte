<slot />
<script>
  import { Theme, Colorful } from '$lib/theme.jsx';
  import { onMount } from 'svelte';

  onMount(() => {
    Theme.init();
    Colorful.init();
  });
</script>
