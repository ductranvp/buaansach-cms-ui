<template>
  <div v-loading="isLoading">
    <el-table
      class="full-width"
      :fit="true"
      :data="tableData"
      :sortable="true"
      :default-sort="defaultSort"
      row-key="guid"
      lazy
      :load="load"
      stripe
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      :size="tableSize"
    >
      <slot>
        <!-- column definitions here -->
      </slot>
    </el-table>
    <el-row type="flex" justify="end" class="margin-top-10">
      <el-pagination
        background
        @current-change="onPageChange"
        @size-change="onSizeChange"
        :current-page.sync="tableConfig.currentPage"
        :page-sizes="tableConfig.pageSizes"
        :page-size="tableConfig.pageSize"
        :total="tableData.length"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "LazyDataTable",
    props: {
      tableSize: {
        type: String,
        default: "small"
      },
      load: Function,
      data: Array,
      filter: Object,
      defaultSort: {
        type: Object,
        default: function () {
          return {prop: "createdDate", order: "descending"};
        }
      },
      config: Object
    },
    created() {
      console.log(this.data);
      this.tableData = this.data;
    },
    data() {
      return {
        isLoading: false,
        tableData: [],
        tableConfig: {
          totalElements: 0,
          currentPage: 1,
          pageSize: 20,
          pageSizes: [10, 20, 30, 50, 100],
          sort: {
            sortDirection: "DESC",
            sortField: "createdDate"
          }
        }
      };
    },
    watch: {
      data: function (val) {
        this.tableData = this.data;
      },
      filter: {
        deep: true,
        handler(val) {
          this.onFilterChange(val);
        }
      }
    },
    methods: {
      // eslint-disable-next-line no-unused-vars
      onFilterChange(filter) {
        console.log(filter);
      },
      onSizeChange(size) {
        this.tableConfig.pageSize = size;
      },
      onPageChange(page) {
        this.tableConfig.currentPage = page;
      },
    }
  };
</script>

<style scoped>

</style>
