<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
            <svg-icon :icon-class="onlyOneChild.meta.icon"/>
            <template #title>{{ generateTitle(onlyOneChild.meta.title) }}</template>
        </el-menu-item>
      </app-link>
    </template>
  </div>
</template>

<script>
import { isExternal } from '@/utils/common'
import AppLink from './Link'

export default {
    name: 'SidebarItem',
    components: { AppLink },
    props: {
    // route object
        item: {
            type: Object,
            required: true
        },
        isNest: {
            type: Boolean,
            default: false
        },
        basePath: {
            type: String,
            default: ''
        }
    },
    data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
        this.onlyOneChild = null
        return {}
    },
    methods: {
        generateTitle(title) {
            const hasKey = this.$t('route.' + title)
            if (hasKey) {
                const translatedTitle = this.$t('route.' + title)
                return translatedTitle
            }
            return title
        },
        hasOneShowingChild(children = [], parent) {
            const showingChildren = children.filter(item => {
                if (item.hidden) {
                    return false
                } else {
                    // Temp set(will be used if only has one showing child)
                    this.onlyOneChild = item
                    return true
                }
            })

            // When there is only one child router, the child router is displayed by default
            if (showingChildren.length === 1) {
                return true
            }

            // Show parent if there are no child router to display
            if (showingChildren.length === 0) {
                this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
                return true
            }

            return false
        },
        resolvePath(routePath) {
            if (isExternal(routePath)) {
                return routePath
            }
            if (isExternal(this.basePath)) {
                return this.basePath
            }
            return `${this.basePath}/${routePath}`.replace('//', '/')
        }
    }
}
</script>
