<template>
  <div
    v-if="svgContent"
    class="svg-icon"
    :style="{ width: size, height: size }"
    v-html="svgContent"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from "vue";

  interface Props {
    name: string;
    size?: string;
    color?: string;
    strokeColor?: string;
    folder?: string;
    preserveOriginalColors?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: "24px",
    color: "currentColor",
    strokeColor: "",
    folder: "",
    preserveOriginalColors: false,
  });

  const svgContent = ref("");
  const loading = ref(true);
  const error = ref(false);

  const loadSvg = async () => {
    try {
      loading.value = true;
      error.value = false;

      const path = props.folder
        ? `/assets/icons/${props.folder}/${props.name}.svg`
        : `/assets/icons/${props.name}.svg`;

      console.log("Loading SVG:", path);

      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to load SVG: ${path}`);

      let svg = await response.text();
      svg = svg.replace(/<\?xml[^?]*\?>/g, "");

      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, "image/svg+xml");
      const svgElement = doc.querySelector("svg");

      if (svgElement) {
        // Remove all static sizing
        svgElement.removeAttribute("width");
        svgElement.removeAttribute("height");
        svgElement.removeAttribute("style");

        // Force SVG to scale with parent
        svgElement.setAttribute("width", "100%");
        svgElement.setAttribute("height", "100%");
        svgElement.style.width = "100%";
        svgElement.style.height = "100%";

        // Add fallback viewBox
        if (!svgElement.hasAttribute("viewBox")) {
          svgElement.setAttribute("viewBox", "0 0 24 24");
        }

        // Apply color unless preserving original colors
        if (!props.preserveOriginalColors && props.color) {
          svgElement
            .querySelectorAll('[fill]:not([fill="none"])')
            .forEach((el) => el.setAttribute("fill", props.color));
          if (!svgElement.querySelector("[fill]")) {
            svgElement.setAttribute("fill", props.color);
          }
        }

        // Apply stroke unless preserving original colors
        if (!props.preserveOriginalColors && props.strokeColor) {
          svgElement
            .querySelectorAll("[stroke]")
            .forEach((el) => el.setAttribute("stroke", props.strokeColor));
        }

        svgElement.setAttribute("role", "img");
        svgElement.setAttribute("aria-hidden", "true");

        // ✅ Assign cleaned SVG
        svgContent.value = svgElement.outerHTML;
      }
    } catch (e) {
      console.error("Error loading SVG:", e);
      error.value = true;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Run only in browser (fix SSR invalid URL)
  onMounted(() => {
    loadSvg();
  });

  // Re-load when props change
  watch(
    () => [
      props.name,
      props.folder,
      props.color,
      props.strokeColor,
      props.preserveOriginalColors,
    ],
    () => {
      if (process.client) loadSvg();
    }
  );
</script>

<style scoped>
  .svg-icon svg {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
