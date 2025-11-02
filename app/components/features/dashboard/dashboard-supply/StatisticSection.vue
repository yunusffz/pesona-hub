<template>
  <div class="grid grid-cols-4 gap-4">
    <BigNumber
      number="100"
      title="Kapasitas Penyediaan"
      :growth="10"
      unit="ton"
      description="Supply Description"
    />
    <BigNumber
      number="100"
      title="Supply"
      :growth="-10"
      unit="%"
      description="Supply Description"
    />
    <BigNumber
      number="100"
      title="Supply"
      :growth="-10"
      unit="%"
      description="Supply Description"
    />
    <BigNumber number="3,138,025,000" title="Nilai Transaksi Ekonomi" />
  </div>
</template>
<script setup lang="ts">
  import BigNumber from "../big-number/BigNumber.vue";
</script>
