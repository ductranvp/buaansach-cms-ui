<template>
  <div v-loading="isLoading">
    <el-table
      class="full-width"
      :fit="true"
      :data="tableData"
      sortable="custom"
      @sort-change="onSortChange"
      :default-sort="defaultSort"
      stripe
      border
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
        :total="tableConfig.totalElements"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </el-row>
  </div>
</template>

<script>
export default {
  name: "DataTable",
  props: {
    tableSize: {
      type: String,
      default: "small"
    },
    defaultSort: {
      type: Object,
      default: function() {
        return { prop: "createdDate", order: "descending" };
      }
    },
    serverPagination: {
      type: Boolean,
      default: true
    },
    fetchData: Function,
    filter: Object,
    config: Object
  },
  data() {
    return {
      isLoading: false,
      tableData: [],
      tableConfig: {
        totalElements: 0,
        currentPage: 1,
        pageSize: 5,
        pageSizes: [5, 10, 20, 30, 50, 100],
        sort: {
          sortDirection: "DESC",
          sortField: "createdDate"
        }
      }
    };
  },
  mounted() {
    /* assign config */
    if (this.config) {
      if (this.config.pageSizes) {
        this.tableConfig.pageSizes = this.config.pageSizes;
        this.tableConfig.pageSize = this.config.pageSizes[0];
      }
      if (this.config.pageSize) {
        this.tableConfig.pageSize = this.config.pageSize;
      }
      if (this.config.sort) {
        this.tableConfig.sort = this.config.sort;
      }
    }
    this.renderTable();
  },
  watch: {
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
      this.renderTable();
    },
    onSortChange(sort) {
      if (sort.order === null) {
        this.tableConfig.sort.sortField = "createdDate";
        this.tableConfig.sort.sortDirection = "DESC";
      } else if (sort.order === "ascending") {
        this.tableConfig.sort.sortField = sort.prop;
        this.tableConfig.sort.sortDirection = "ASC";
      } else {
        this.tableConfig.sort.sortField = sort.prop;
        this.tableConfig.sort.sortDirection = "DESC";
      }
      this.renderTable();
    },
    onSizeChange(size) {
      this.tableConfig.pageSize = size;
      this.renderTable();
    },
    onPageChange(page) {
      this.tableConfig.currentPage = page;
      this.renderTable();
    },
    renderTable() {
      if (this.serverPagination) {
        this.getData();
      } else {
        this.tableData = this.data;
      }
    },
    getData() {
      const params = {};
      params.search = this.filter.searchKey;
      params.page = this.tableConfig.currentPage;
      params.size = this.tableConfig.pageSize;
      params.sortField = this.tableConfig.sort.sortField;
      params.sortDirection = this.tableConfig.sort.sortDirection;
      this.fetchData(params).then(response => {
        const { data } = response;
        this.tableData = data.content;
        this.tableConfig.totalElements = data.totalElements;
      });
    },
    reload() {
      this.getData();
    }
  }
};
</script>

<style scoped>
/deep/.el-table__fixed-right {
  height: 100% !important;
}
</style>
