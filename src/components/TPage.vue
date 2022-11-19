<template>
  <div class="page">
    <t-loading v-if="loading" />
    <template v-else>
      <div class="header">
        <h1>{{ title }}</h1>
        <slot name="btn"></slot>
      </div>
      <div class="page-container">
      <slot name="content"></slot>
      </div>
    </template>
  </div>
</template>

<script>
import TLoading from './TLoading.vue'

export default {
  name: 'TPage',
  props: {
    title: String,
    loading: Boolean
  },
  components: { TLoading }
}

</script>

<style lang="stylus" scoped>

.page
  display: flex
  flex-direction: column
  align-items: center
.page-container
  display: flex
  flex-direction: column

.page-container, .header
  width: 80%

.header
  display: flex;
  justify-content: space-between;
  align-items: center;


</style>