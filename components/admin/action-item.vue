<template>
  <v-tooltip :text="tooltipText" :location="tooltipLocation">
    <template #activator="{ props: tooltipProps }">
      <v-hover>
        <template #default="{ isHovering, props: hoverProps }">
          <v-btn
            v-bind="{
              ...tooltipProps,
              ...hoverProps,
              color: isHovering ? 'secondary' : 'grey-darken-2',
            }"
            :size="size"
            :class="className"
            class="hover-fade"
            variant="text"
            icon
            @click="$emit('click')"
            @mouseenter="tooltipProps.onMouseenter"
            @mouseleave="tooltipProps.onMouseleave"
          >
            <v-icon>{{ icon }}</v-icon>
          </v-btn>
        </template>
      </v-hover>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
  type TooltipBase =
    | 'top'
    | 'bottom'
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'center';

  type TooltipComposite =
    | 'center center'
    | 'top start'
    | 'top end'
    | 'top left'
    | 'top right'
    | 'top center'
    | 'bottom start'
    | 'bottom end'
    | 'bottom left'
    | 'bottom right'
    | 'bottom center'
    | 'start top'
    | 'start bottom'
    | 'start center'
    | 'end top'
    | 'end bottom'
    | 'end center'
    | 'left top'
    | 'left bottom'
    | 'left center'
    | 'right top'
    | 'right bottom'
    | 'right center';

  type TooltipLocation = TooltipBase | TooltipComposite;

  type PropsType = {
    className?: string;
    icon: string;
    size?: 'x-large' | 'large' | 'default' | 'small' | 'x-small';
    tooltipLocation?: TooltipLocation;
    tooltipText: string;
  };

  withDefaults(defineProps<PropsType>(), {
    className: undefined,
    size: 'small',
    tooltipLocation: 'left',
  });

  defineEmits(['click']);
</script>

<style lang="scss" scoped>
  .hover-fade {
    transition: color ease-in-out 200ms;
  }
</style>
