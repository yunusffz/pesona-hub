export default defineAppConfig({
  cms: {
    product: {
      canCreate: false,
      canUpdate: true,
      canDelete: false,
    },
    mitra: {
      canCreate: true,
      canUpdate: true,
      canDelete: true,
    },
  },
});
