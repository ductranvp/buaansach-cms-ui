<template>
  <div v-loading="isLoading">
    <el-table
      class="full-width"
      :data="tableData"
      :sortable="true"
      :default-sort="defaultSort"
      :size="tableSize"
      :fit="true"
      stripe
      border>

      <el-table-column v-if="showIndex" type="index" :index="indexMethod" :label="$t('common.entity.audit.index')">
      </el-table-column>

      <slot>
        <!-- column definitions here -->
      </slot>

      <template v-if="showAudit">
        <el-table-column v-for="audit in customAudit" :key="audit"
                         :sortable="audit === 'createdDate' || audit === 'lastModifiedDate'"
                         :prop="audit"
                         :label="$t('common.entity.audit.' + audit)">
          <template slot-scope="{row}">
            <span v-if="audit === 'createdDate' ||  audit === 'lastModifiedDate'">
              {{ row[audit] | moment("HH:mm - DD/MM/YYYY") }}
            </span>
            <span v-else>{{row[audit]}}</span>
          </template>
        </el-table-column>
      </template>

      <slot name="action">
        <!-- action definitions here -->
      </slot>
    </el-table>
    <el-row type="flex" justify="end" class="margin-top-10">
      <el-pagination
        background
        @current-change="onPageChange"
        @size-change="onSizeChange"
        :current-page.sync="tableConfig.currentPage"
        :page-count="tableConfig.pageCount"
        :page-sizes="tableConfig.pageSizes"
        :page-size="tableConfig.pageSize"
        :total="data.length"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "RawDataTable",
    props: {
      showIndex: Boolean,
      showAudit: Boolean,
      customAudit: {
        type: Array,
        default: () => {
          return ["createdBy", "createdDate", "lastModifiedBy", "lastModifiedDate"];
        }
      },
      tableSize: {
        type: String,
        default: "small"
      },
      data: Array,
      filter: Object,
      filterMethod: Function,
      defaultSort: {
        type: Object,
        default: function () {
          return {prop: "createdDate", order: "ascending"};
        }
      },
      config: Object,
    },
    created() {
      this.renderTable();
    },
    data() {
      return {
        isLoading: false,
        tableData: [],
        tableConfig: {
          totalElements: 0,
          currentPage: 1,
          pageCount: 4,
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
        console.log(val);
        this.renderTable();
      },
      filter: {
        deep: true,
        handler(val) {
          this.onFilterChange(val);
        }
      }
    },
    methods: {
      indexMethod(index) {
        return index + 1;
      },
      onFilterChange(filter) {
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
        if (!this.data.length) {
          this.tableData = [];
          return;
        }
        const startIndex = (this.tableConfig.currentPage - 1) * this.tableConfig.pageSize;
        const endIndex = this.tableConfig.currentPage * this.tableConfig.pageSize;
        if (this.data.length - 1 >= startIndex) {
          let temp = this.data;
          if (this.filter) {
            temp = this.filterMethod(temp, this.filter);
          }
          this.tableData = temp.slice(startIndex, endIndex);
        }
      }
    }
  };
</script>

<style scoped>

</style>
