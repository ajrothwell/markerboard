<template>
  <div>
    <h3>Sale Information</h3>
    <span>Address: </span><span>{{ currentSelectedData.StreetAddress }}</span><br>
    <span>Sale Type: </span><span>{{ currentSelectedData.SaleType }}</span><br>
    <span>Auction Date: </span><span>{{ currentSelectedData.AuctionDate }}</span><br>
    <span>Opening Bid: </span><span>{{ currentSelectedData.OpeningBid }}</span><br>
    <span>Status: </span><span>{{ currentSelectedData.Status }}</span><br>
    <span>Attorney: </span><span>{{ currentSelectedData.Attorney }}</span><br>
    <span>Book/Writ: </span><span>{{ currentSelectedData.BooknWrit }}</span><br>
    <span>Seller: </span><span>{{ currentSelectedData.Seller }}</span><br>


    <h3>Property Information</h3>
    <span>Property Owner: </span><span>{{ opaOwners }}</span><br>
    <span>OPA #: </span><span>{{ currentSelectedData.AssessmentID }}</span><br>
    <span>Assessed Value: </span><span>{{ opaData.market_value }}</span><br>
    <span>Area: </span><span>{{ opaData.total_area }} ft</span><br>
    <span>Description: </span><span>{{ opaData.building_code_description }}</span><br>
    <span>Zoning Description: </span><span>{{ this.zoning }}</span><br>
  </div>
</template>
<script>
import TopicComponent from '@philly/vue-comps/src/components/TopicComponent.vue';
import helpers from '../util/helpers.js';
console.log('in PropertyCard, helpers:', helpers);

export default {
  mixins: [ TopicComponent ],
  props: {
    title: {
      type: String,
      default: 'Title',
    },
  },
  data() {
    return {
      locationOpen: false,
    };
  },
  computed: {
    servicesOffered() {
      return this.$props.item.services_offered.split(',');
    },
    selectedResources() {
      return this.$store.state.selectedResources;
    },
    currentSelectedData() {
      if (this.$store.state.currentSelectedData) {
        return this.$store.state.currentSelectedData[0] || [];
      } 
      return [];
      
    },
    geocodeProperties() {
      if (this.$store.state.geocode.data) {
        if (this.$store.state.geocode.data.properties) {
          return this.$store.state.geocode.data.properties;
        } 
        return {};
        
      } 
      return {};
      
    },
    opaData() {
      if (this.$store.state.sources.opa.data) {
        return this.$store.state.sources.opa.data;
      } 
      return {};
      
    },
    zoning() {
      return helpers.ZONING_CODE_MAP[this.geocodeProperties.zoning];
    },
    opaOwners() {
      let owners;
      if (this.geocodeProperties.opa_owners) {
        owners = this.geocodeProperties.opa_owners.join(',');
      } else {
        owners = '';
      }
      return owners;
    },
  },
  watch: {
    selectedResources(nextSelectedResources) {
      if (this.locationOpen || nextSelectedResources.includes(this.$props.item._featureId)) {
        if (this.locationOpen === false) {
          this.openLocation();
        } else if (this.locationOpen && !nextSelectedResources.includes(this.$props.item._featureId)) {
          this.locationOpen = false;
        }
      } else {
        this.locationOpen = false;
      }
    },
  },
  mounted() {
    if (this.selectedResources.includes(this.item._featureId)) {
      this.locationOpen = true;
    }
  },
  methods: {
    openLocation() {
      this.locationOpen = true;
      const el = this.$el;
      const visible = this.isElementInViewport(el);
      if (!visible) {
        el.scrollIntoView();
      }
    },
    isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      // console.log('bounding box', rect);
      const visibility = {
        // TODO the 108 below is account for the combined height of the
        // app header and address header. this is not a good long-term
        // solution - instead, use the `bottom` value of the address header's
        // bounding rect. however, this should only fire on small devices,
        // which would require again hard-coding screen breakpoints from
        // standards or some other magic, which might not a huge
        // improvement in terms of decoupling logic and presentation. hmm.
        top: rect.top >= 108,
        left: rect.left >= 0,
        bottom: rect.bottom <= (window.innerHeight || document.documentElement.clientHeight),
        right: rect.right <= (window.innerWidth || document.documentElement.clientWidth),
      };

      // console.log('visibility', visibility);

      // return if all sides are visible
      return Object.values(visibility).every(val => val);
    },
    expandLocation() {
      this.locationOpen = !this.locationOpen;
      const selectedResource = this.$props.item._featureId;
      const selectedResources = [ ...this.selectedResources ];
      let latestSelectedResourceFromExpand = null;
      if (this.locationOpen) {
        selectedResources.push(selectedResource);
        latestSelectedResourceFromExpand = selectedResource;
      } else {
        selectedResources.splice(selectedResources.indexOf(selectedResource), 1);
      }
      // this.locationOpen ? selectedResources.push(selectedResource) : selectedResources.splice(selectedResources.indexOf(selectedResource), 1);
      this.$store.commit('setSelectedResources', selectedResources);
      this.$store.commit('setLatestSelectedResourceFromExpand', latestSelectedResourceFromExpand);
    },
  },
};
</script>
<style lang="scss">
.location-item {
  position: relative;
  border-bottom: 1px solid black;
  height:100%;
  
  &:hover::after {
    color: white;
  }

  .location-title {
    cursor: pointer;
    padding: 1rem;
    margin-bottom: 0;
    &:hover{
      background: #2176d2;
      color: white;
    }
  }

  &::after{
    position: absolute;
    right:1rem;
    top: 0;
    content: '+';
    font-weight: 900;
    font-size:1.5rem;
    z-index: 100;
  }
  &.open{
    h2{
      color:white;
      background-color: #2176d2;
      font-weight: 900;
    }
    &::after{
      content: '-';
      color:white;
    }
  }
  .location-content{
    overflow: hidden;
    height:0;

    &.location-open{
      padding: 1rem;
      height: 100%;
      overflow: initial;
    }
  }
}
</style>
