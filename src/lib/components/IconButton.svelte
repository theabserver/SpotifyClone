<script lang="ts">
  import type { Icon } from "lucide-svelte";
  import type { ComponentType } from "svelte";

  export let icon: ComponentType<Icon>;
  export let label: string;
  interface $$Props extends HTMLButtonElement {
    icon: ComponentType<Icon>;
    label: string;
  }
  let button: HTMLButtonElement;
  export function getButton() {
    return button;
  }
</script>

<button
  bind:this={button}
  on:click
  on:mouseover
  on:focus
  on:keydown
  class="icon-button"
  title={label}
  {...$$restProps}
>
  <svelte:component
    this={icon}
    color="var(--text-color)"
    aria-hidden="true"
    focusable="false"
  />
</button>

<style lang="scss">
  button {
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    width: 38px;
    height: 38px;
    :global(svg) {
      vertical-align: middle;
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    &:active {
      background-color: var(--menu-background-color);
    }
  }
</style>
