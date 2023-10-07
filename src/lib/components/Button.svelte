<script lang="ts">
  import type {
    HTMLAnchorAttributes,
    HTMLButtonAttributes,
  } from "svelte/elements";

  type Element = $$Generic<"button" | "a">;

  interface ButtonComponentElements {
    button: HTMLButtonAttributes;
    a: HTMLAnchorAttributes;
  }

  type $$Props = ButtonComponentElements[Element] & {
    element: Element;
    variant?: "solid" | "outline" | "danger";
    className?: string;
  };

  export let element: Element;
  export let variant: "solid" | "outline" | "danger" = "solid";
  export let className: string = "";
  let node: HTMLAnchorElement | HTMLButtonElement;

  export function focus() {
    node.focus();
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
  this={element}
  bind:this={node}
  class="btn btn-{variant} {className}"
  on:click
  {...$$restProps}
>
  <slot />
</svelte:element>
