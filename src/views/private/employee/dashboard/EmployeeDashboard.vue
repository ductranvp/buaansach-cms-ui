<template>
  <p></p>
</template>

<script>

  import EmployeePosService from "@/service/employee/employee.pos.service";

  export default {
    name: "EmployeeDashboard",
    data() {
      return {
        seats: [],
        areas: [],
      };
    },
    created() {
      this.getSeats();
    },
    methods: {
      async getSeats() {
        if (this.$route.params.storeGuid) {
          const {data} = await EmployeePosService.getListSeatByStoreGuid(this.$route.params.storeGuid);
          console.log(data);
        }
      }
    }
  };
</script>

<style scoped></style>
