<template>
  <div
    v-if="svgContent"
    class="svg-icon"
    :style="{ width: size, height: size }"
    v-html="svgContent"
  />
  <div v-else-if="loading" class="svg-icon-loading">Loading...</div>
  <div v-else-if="error" class="svg-icon-error">⚠️</div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from "vue";

  interface Props {
    name: string;
    size?: string;
    color?: string;
    strokeColor?: string;
    folder?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: "24px",
    color: "currentColor",
    strokeColor: "",
    folder: "",
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
        svgElement.removeAttribute("width");
        svgElement.removeAttribute("height");
        if (!svgElement.hasAttribute("viewBox")) {
          svgElement.setAttribute("viewBox", "0 0 24 24");
        }

        if (props.color) {
          svgElement
            .querySelectorAll('[fill]:not([fill="none"])')
            .forEach((el) => el.setAttribute("fill", props.color));
          if (!svgElement.querySelector("[fill]")) {
            svgElement.setAttribute("fill", props.color);
          }
        }

        if (props.strokeColor) {
          svgElement
            .querySelectorAll("[stroke]")
            .forEach((el) => el.setAttribute("stroke", props.strokeColor));
        }

        svgElement.setAttribute("role", "img");
        svgElement.setAttribute("aria-hidden", "true");

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
    () => [props.name, props.folder, props.color, props.strokeColor],
    () => {
      if (process.client) loadSvg();
    }
  );
</script>
