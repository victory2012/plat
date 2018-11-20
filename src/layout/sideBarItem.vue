<template>
  <div>
    <template v-for="value in menuData">
      <!-- :index="value.link" -->
      <el-submenu v-if="value !=='' && value.children && value.children !== ''"
        :index="value.type"
        @click="barClickHandle(value)"
        :key="value.id">
        <template slot="title">
          <i :class="value.icon"></i>
          <span slot="title">{{value.text}}</span>
        </template>
        <MenuTree :menuData="value.children"></MenuTree>
      </el-submenu>
      <!-- :index="value.link" -->
      <el-menu-item v-else-if="value !==''"
        @click="barClickHandle(value)"
        :index="value.type"
        :key="value.id">
        <i :class="value.icon"></i>
        <span slot="title">{{value.text}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  props: ['menuData'],
  name: 'MenuTree',
  methods: {
    barClickHandle(item) {
      sessionStorage.setItem('projectType', item.type);
      this.$store.commit('setProjectType', item.type);
      this.$router.push(`${item.link}`);
    },
  },
};
</script>

