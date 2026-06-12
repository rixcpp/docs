<script setup>
import { computed } from "vue";
import { useData } from "vitepress";

const { page, site } = useData();

const labels = {
  docs: "Docs",
  guides: "Guides",
  glossary: "Glossary",
  gpu: "GPU terms",
  register: "Register",
};

const items = computed(() => {
  const path = page.value.relativePath
    .replace(/\.md$/, "")
    .replace(/\/index$/, "");

  const parts = path.split("/").filter(Boolean);

  const result = [
    {
      text: "Docs",
      link: "/",
    },
  ];

  let current = "";

  for (const part of parts) {
    current += `/${part}`;

    result.push({
      text: labels[part] || formatLabel(part),
      link: current,
    });
  }

  return result;
});

function formatLabel(value) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
</script>

<template>
  <nav class="vix-breadcrumb" aria-label="Breadcrumb">
    <a href="/" class="vix-breadcrumb-home" aria-label="Docs">
      <span>⌂</span>
    </a>

    <template v-for="(item, index) in items" :key="item.link">
      <span class="vix-breadcrumb-separator">/</span>

      <a
        v-if="index < items.length - 1"
        class="vix-breadcrumb-link"
        :href="item.link"
      >
        {{ item.text }}
      </a>

      <span v-else class="vix-breadcrumb-current">
        {{ item.text }}
      </span>
    </template>
  </nav>
</template>
