<template>
  <component :is="tag">
    <div class="card__header">
      <header>
        <slot name="header" />
      </header>
    </div>
    <div class="card__content">
      <slot />
    </div>
  </component>
</template>

<script>
export default {
  name: 'UiCard',

  props: {
    tag: {
      type: [String, Object, Function],
      default: 'div',
    },

    cover: {
      type: String,
    },
  },
};
</script>

<style scoped>
.card__header {
  font-family: Roboto, sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 44px;
  text-decoration: none;
  padding-bottom: 20px;
}
.card__content {
  font-family: Roboto, sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 44px;
  border-left: 5px solid var(--blue);
  display: block;
}
</style>
