<template>
  <div v-loading="isLoading">
    <el-table
        :highlight-current-row="highlightCurrentRow"
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
      <el-table-column v-if="showIndex" type="index"
                       :index="indexMethod"
                       :label="$t('common.entity.audit.index')">
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

      <slot name="action"></slot>
    </el-table>
    <el-row type="flex" justify="end" class="margin-top-10">
      <el-pagination
          background
          @current-change="onPageChange"
          @size-change="onSizeChange"
          :current-page.sync="tableConfig.currentPage"
          :page-sizes="tableConfig.pageSizes"
          :page-count="tableConfig.pageCount"
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
            highlightCurrentRow: Boolean,
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
            defaultSort: {
                type: Object,
                default: function () {
                    return {prop: "createdDate", order: "descending"};
                }
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
                    pageSize: 20,
                    pageCount: 4,
                    pageSizes: [10, 20, 30, 50, 100],
                    sort: {
                        sortDirection: this.defaultSort.order === 'descending' ? "DESC" : "ASC",
                        sortField: this.defaultSort.prop,
                    }
                }
            };
        },
        created() {
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
            indexMethod(index) {
                return index + 1;
            },
            // eslint-disable-next-line no-unused-vars
            onFilterChange(filter) {
                console.log('change');
                this.renderTable();
            },
            onSortChange(sort) {
                if (sort.order === null) {
                    this.tableConfig.sort.sortField = this.defaultSort.prop;
                    this.tableConfig.sort.sortDirection = this.defaultSort.order === 'descending' ? "DESC" : "ASC";
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
                this.getData();
            },
            getData(cb) {
                const params = {};
                params.search = this.filter.searchKey;
                params.page = this.tableConfig.currentPage;
                params.size = this.tableConfig.pageSize;
                params.sortField = this.tableConfig.sort.sortField;
                params.sortDirection = this.tableConfig.sort.sortDirection;
                this.fetchData(params).then(response => {
                    const {data} = response;
                    this.tableData = data.content;
                    this.tableConfig.totalElements = data.totalElements;
                    /* cb is callback for reload function, using when need loading animation */
                    if (cb) {
                        cb();
                    }
                });
            },
            reload(cb) {
                this.getData(cb);
            }
        }
    };
</script>

<style scoped>
  /deep/ .el-table__fixed-right {
    height: 100% !important;
  }
</style>
