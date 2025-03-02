<template>
  <div class='select-container' v-if='!isShared'>
    <label
      class='active'
      :class="{ 'is-readonly': isReadonly }"
      @click='toggleSelect'
    >
      <span>Column</span>
      <ButtonIcon v-if='!isReadonly' name='gear' style='float: right; padding: 0' />
    </label>
    <Select
      v-if='isSelectOpen'
      title='Change column'
      class='select-items'
    >
      <div class='body-select'>
        <div
          v-for='(column, $index) in sortedColumns'
          :key='$index'
          class='list-item'
          @click='toggle(column)'
        >
          <span class='check' :class="{ checked: isApplied(column) }" />
          <span class='name'>{{ column.name }}</span>
        </div>
      </div>
    </Select>
  </div>
  <div v-if='isSelectOpen' class='select-overlay' @click.self='toggleSelect' />

  <div class='selected-item'>{{ columnName }}</div>
</template>

<script>
import ButtonIcon from '@/components/buttons/icon'
import Select from '@/components/select';
import { get, call } from 'vuex-pathify';

export default {
  components: {
    ButtonIcon,
    Select
  },
  props: {
    columnId: { type: Number, required: false, default: null },
    isReadonly: { type: Boolean, default: false },
    isShared: { type: Boolean, default: false },
  },
  emits: ['toggle'],
  data: () => ({
    isSelectOpen: false,
    selectedId: undefined,
  }),
  computed: {
    id() { return parseInt(this.$route.params.issueId); },
    columns: get('board/columns'),
    column() {
      return this.columns.find(v => v.id === this.selectedId);
    },
    columnName() {
      return this.column == null ? '' : this.column.name;
    },
    sortedColumns() {
      return [...this.columns].sort((a, b) => (a.position - b.position));
    },
  },
  created() {
    this.selectedId = this.columnId;
  },
  watch: {
  },
  methods: {
    ...call([
      'board/moveIssue'
    ]),
    toggleSelect() {
      if (this.isReadonly) { return; }
      this.isSelectOpen = !this.isSelectOpen;
    },
    isApplied({ id }) {
      return id === this.selectedId;
    },
    toggle({ id }) {
      if (id === this.selectedId) return;
      if (this.column == null) return;
      const fromColumnIndex = this.columns.findIndex(v => v.id === this.selectedId);
      const toColumnIndex = this.columns.findIndex(v => v.id === id);
      const fromIssueIndex = this.column.issues.findIndex(v => v.id === this.id);

      if (fromColumnIndex < 0) return;
      if (toColumnIndex < 0) return;
      if (fromIssueIndex < 0) return;
      this.moveIssue({
        fromColumnIndex,
        toColumnIndex,
        fromIssueIndex,
        toIssueIndex: 0 // To TOP
      });
      this.selectedId = id;
      this.toggleSelect();
    }
  }
}
</script>

<style scoped lang='sass'>
.select-container
  position: relative

.select-items
  position: absolute
  top: 28px
  width: 220px
  z-index: 2

.select-overlay
  height: 100vh
  left: 0
  position: fixed
  top: 0
  width: 100vw
  z-index: 1

.body-select
  overflow-y: scroll
  max-height: calc(100vh - 300px)

label
  align-items: center
  color: #283593
  display: flex
  font-weight: 500
  justify-content: space-between
  padding: 6px 0
  user-select: none

  &.active:not(.is-readonly)
    cursor: pointer

    &:hover
      opacity: 0.8

.placeholder
  color: #5c6bc0
  font-size: 12px
  font-weight: 100

.list-item
  display: flex
  align-items: center
  padding: 8px
  cursor: pointer

  &:hover
    background-color: rgba(197, 202, 233, 0.8) // #c5cae9

  &:active
    background-color: rgba(197, 202, 233, 0.6) // #c5cae9

  &:not(:last-child)
    border-bottom: 1px solid #c5cae9

  .check
    background-image: url('../../../assets/icons/issue/check.svg')
    background-position: center
    background-repeat: no-repeat
    height: 16px
    margin-right: 8px
    opacity: 0
    width: 16px

    &.checked
      opacity: 100

  .name
    font-size: 14px
    font-weight: 500
</style>
