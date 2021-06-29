<template>
  <!-- 个人信息页面 -->
  <div>个人信息页面
    {{token}}
    {{avatar}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['token','avatar'])
  },
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style scoped>
</style>
