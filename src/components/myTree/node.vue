<template>
    <collapse-transition>
        <!--<ul :class="classes" v-if="data.children">-->
            <div style="padding-left:16px;margin-top:4px;" v-if="data.children">
                <span :class="arrowClasses" @click="handleExpand">
                    <Icon v-if="showArrow" type="arrow-right-b"></Icon>
                    <Icon v-if="showLoading" type="load-c" class="ivu-load-loop"></Icon>
                </span>
                <Checkbox
                        v-if="showCheckbox"
                        :value="data.checked"
                        :indeterminate="data.indeterminate"
                        :disabled="data.disabled || data.disableCheckbox"
                        @click.native.prevent="handleCheck">
                    <Render v-if="data.render" :render="data.render" :data="data" :node="node"></Render>
                    <Render v-else-if="isParentRender" :render="parentRender" :data="data" :node="node"></Render>
                    <span v-else :class="titleClasses" @click="handleSelect">{{ data.title }}</span>
                </Checkbox>
                <div style="padding-left:16px;margin-top:4px;">
                    <My-tree-node
                            v-if="data.expand"
                            v-for="(item, i) in data.children"
                            :key="i"
                            :data="item"
                            :multiple="multiple"
                            :show-checkbox="showCheckbox">
                    </My-tree-node>
                </div>
            </div>
        <!--</ul>-->

        <span :class="classes" v-if="!data.children">
                <span :class="arrowClasses" @click="handleExpand">
                    <Icon v-if="showArrow" type="arrow-right-b"></Icon>
                    <Icon v-if="showLoading" type="load-c" class="ivu-load-loop"></Icon>
                </span>
                <Checkbox
                        v-if="showCheckbox"
                        :value="data.checked"
                        :indeterminate="data.indeterminate"
                        :disabled="data.disabled || data.disableCheckbox"
                        @click.native.prevent="handleCheck">
                    <Render v-if="data.render" :render="data.render" :data="data" :node="node"></Render>
                <Render v-else-if="isParentRender" :render="parentRender" :data="data" :node="node"></Render>
                <span v-else :class="titleClasses" @click="handleSelect">{{ data.title }}</span>
                </Checkbox>
                <My-tree-node
                        v-if="data.expand"
                        v-for="(item, i) in data.children"
                        :key="i"
                        :data="item"
                        :multiple="multiple"
                        :show-checkbox="showCheckbox">
                </My-tree-node>
        </span>
    </collapse-transition>
</template>
<script>
    import Checkbox from '../../../node_modules/iview/src/components/checkbox/checkbox.vue';
    import Icon from '../../../node_modules/iview/src/components/icon/icon.vue';
    import Render from './render';
    import CollapseTransition from '../../../node_modules/iview/src/components/base/collapse-transition';
    import Emitter from '../../../node_modules/iview/src/mixins/emitter';
    import { findComponentUpward } from '../../../node_modules/iview/src/utils/assist';

    const prefixCls = 'ivu-tree';

    export default {
        name: 'MyTreeNode',
        mixins: [ Emitter ],
        components: { Checkbox, Icon, CollapseTransition, Render },
        props: {
            data: {
                type: Object,
                default () {
                    return {};
                }
            },
            multiple: {
                type: Boolean,
                default: false
            },
            showCheckbox: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                prefixCls: prefixCls
            };
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}-children`
                ];
            },
            selectedCls () {
                return [
                    {
                        [`${prefixCls}-node-selected`]: this.data.selected
                    }
                ];
            },
            arrowClasses () {
                return [
                    `${prefixCls}-arrow`,
                    {
                        [`${prefixCls}-arrow-disabled`]: this.data.disabled,
                        [`${prefixCls}-arrow-open`]: this.data.expand
                    }
                ];
            },
            titleClasses () {
                return [
                    `${prefixCls}-title`,
                    {
                        //[`${prefixCls}-title-selected`]: this.data.selected
                        [`${prefixCls}-title`]: this.data.selected
                    }
                ];
            },
            showArrow () {
                return (this.data.children && this.data.children.length) || ('loading' in this.data && !this.data.loading);
            },
            showLoading () {
                return 'loading' in this.data && this.data.loading;
            },
            isParentRender () {
                const Tree = findComponentUpward(this, 'MyTree');
                return Tree && Tree.render;
            },
            parentRender () {
                const Tree = findComponentUpward(this, 'MyTree');
                if (Tree && Tree.render) {
                    return Tree.render;
                } else {
                    return null;
                }
            },
            node () {
                const Tree = findComponentUpward(this, 'MyTree');
                if (Tree) {
                    // 将所有的 node（即flatState）和当前 node 都传递
                    return [Tree.flatState, Tree.flatState.find(item => item.nodeKey === this.data.nodeKey)];
                } else {
                    return [];
                }
            }
        },
        methods: {
            handleExpand () {
                const item = this.data;
                if (item.disabled) return;

                // async loading
                if (item.children.length === 0) {
                    const tree = findComponentUpward(this, 'MyTree');
                    if (tree && tree.loadData) {
                        this.$set(this.data, 'loading', true);
                        tree.loadData(item, children => {
                            this.$set(this.data, 'loading', false);
                            if (children.length) {
                                this.$set(this.data, 'children', children);
                                this.$nextTick(() => this.handleExpand());
                            }
                        });
                        return;
                    }
                }

                if (item.children && item.children.length) {
                    this.$set(this.data, 'expand', !this.data.expand);
                    this.dispatch('MyTree', 'toggle-expand', this.data);
                }
            },
            handleSelect () {
                if (this.data.disabled) return;
                this.dispatch('MyTree', 'on-selected', this.data.nodeKey);
            },
            handleCheck () {
                if (this.data.disabled) return;
                const changes = {
                    checked: !this.data.checked && !this.data.indeterminate,
                    nodeKey: this.data.nodeKey
                };
                this.dispatch('MyTree', 'on-check', changes);
                //this.dispatch('MyTree', 'on-selected', this.data.nodeKey);
            }
        }
    };
</script>