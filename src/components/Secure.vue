<template>
  <div>
    <h1>This page is protected by auth</h1>
    <router-link :to="{ name: 'gastos'}">Gastos</router-link>
    <router-view/>
  </div>
</template>