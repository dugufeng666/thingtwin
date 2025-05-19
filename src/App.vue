<script lang="ts">
import { defineComponent } from 'vue'
import Editor from './views/Editor/index.vue'

export default defineComponent({
  name: 'App',
  components: {
    Editor
  }
})
</script>

<template>
  <Editor />
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
