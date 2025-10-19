<template>
  <section class="flex gap-[60px]">
    <div class="rounded-3xl flex-1">
      <NuxtImg
        src="/assets/images/product-1.png"
        alt="Catalog Detail 1"
        class="w-full h-full object-cover rounded-3xl max-h-[579px]"
      />
    </div>
    <div class="flex flex-col gap-6 w-[468px]">
      <div class="flex flex-col gap-4">
        <h1 class="text-[40px] font-medium leading-[48px]">
          Pupuk Cair Organik KUPS Agroforestri Danau Raya
        </h1>
        <div class="flex items-center gap-2">
          <Badge variant="grey" class="text-xs font-medium"
            >Pupuk Organik</Badge
          >
        </div>
        <p class="text-md text-[#585858] leading-6">
          Berikan yang terbaik untuk tanaman Anda dengan pupuk ramah lingkungan
          dari Nagari Danau Raya.
        </p>
      </div>
      <div class="flex flex-col gap-4 p-2">
        <div class="text-[18px] font-semibold text-neutral-900">
          Pilih varian
        </div>
        <div class="flex gap-2.5">
          <Button
            variant="outline"
            class="py-6 px-[18px] border-2 border-neutral-900 rounded-xl"
          >
            
            Botol 500ml Rp. 50.000
          </Button>
          <Button variant="outline">Varian 2</Button>
        </div>
      </div>
    </div>
  </section>
</template>
