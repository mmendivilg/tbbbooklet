<template>
  <div>
    <TravelMap class="travel-map"/>
  </div>
</template>

<script>
import TravelMap from "./TravelMap";

export default {
  components: {
    TravelMap
  }
};
</script>

<style lang="scss" scoped>
.travel-map {
  height: 400px;
  width: 400px;
}
</style>