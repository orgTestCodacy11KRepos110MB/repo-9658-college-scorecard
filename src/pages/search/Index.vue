<style lang="scss">
@import "~/sass/_variables";

.canned-search-wrapper {
  margin-bottom: 8px;
}

.pageBar {
  background-color: rgba(255, 255, 255, 0.7) !important;
}

.searchFab {
  z-index: 500 !important;
  bottom: 64px;
}

  #search-fos-cip-warning, #search-institutions-dolflag{
    width: 100%;

  p {
    font-size: 13px;
    margin-bottom: 0;
  }

  @media (min-width: 960px) {
    p {
      font-size: 14px;
    }
  }

    a{
      color: white !important;
    }
   .dolflag-chip a{
      color: rgba(0, 0, 0, 0.87) !important;
    }
  }

#search-fos-cip-filter-warning {
  p {
    font-size: 13px;
  }

  .v-alert__border {
    border-width: 6px;
  }

  .v-icon {
    font-size: 38px;
  }

  @media (min-width: 960px) {
    p {
      font-size: 16px;
    }
  }
}

.field-of-study-context-panel{
  border-radius: 0px 0px 20px 20px !important;
  border-left: 20px solid $fos-color-gold !important;
}
.institution-context-panel{
  border-radius: 0px 0px 20px 20px !important;
  border-left: 20px solid $darker-green !important;
}
</style>

<style lang="scss" scoped>
@import "~/sass/_variables.scss";
  .dolflag-chip {
    height: auto !important;
    white-space: normal;
    padding:18px;
    margin-right:30px;
  }
</style>

<template>
  <div>
    <!-- Search Form -->
    <v-navigation-drawer
      v-model="showSidebar"
      app
      width="300"
      class="searchSidebar"
      clipped
    >
      <!--<div class="context-toggle-container pa-5 grey lighten-3">
        <h3 class="mb-2">
          Showing Results For:
        </h3>

        <context-toggle
          :display-toggle="displayToggle"
          :control-tab="controlTab"
          @context-switch-click="handleContextToggle"
          @context-tab-change="handleContextToggle"
        />
      </div>-->
      
      <v-card outline v-bind:class="contextRadioClass" class="pa-5 mb-3" style="box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%) !important;">
          <p class="searchForTitle mb-2">SEARCH FOR:</p>
          <v-radio-group v-model="controlRadio" @change="handleContextToggleTwo" column>
            <v-radio
              value="0"
              color="#007000"
            >
              <template v-slot:label>
                <div v-bind:style="{ 'font-weight': contextRadioSchoolStyle, 'color': 'black'}">School</div>
              </template>
            </v-radio>

            <v-radio
              value="1"
              color="#fdbf32"
            >
              <template v-slot:label>
                <div v-bind:style="{ 'font-weight': contextRadioFOSStyle, 'color': 'black'}">Field of Study</div>
              </template>
            </v-radio>
          </v-radio-group>

        </v-card>

      <!-- Search Form Component -->
      <search-form
        v-if="displayToggle === 'institutions'"
        :urlParsedParams="urlParsedParams"
        auto-submit
        display-all-filters
        @search-query="handleInstitutionSearch"
      />

      <!-- Search Fields of Study Component -->
      <search-fos-form
        v-else-if="displayToggle === 'fos'"
        :url-parsed-params="urlParsedParams"
        auto-submit
        @search-query="handleFieldOfStudySearch"
      />

      </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-0">
        <div id="search-result-container" class="pa-sm-8 pa-2">
          <div class="search-result-container">
            <!-- Search Result Info and controls -->
            <v-card
              class="mt-2 mb-4 py-4 px-4 elevaton-0 pageBar"
              v-show="!isLoading"
            >
              <v-row class="">
                <v-col cols="12" sm="7" class="py-2 px-4">
                  <div id="search-result-info-count" class>
                    <p class="title mb-0">
                      {{ results.meta.total | separator }} Results
                      <v-btn
                        color="primary"
                        text-color="white"
                        @click="clearSearchForm"
                        x-small
                        fab
                        class="d-inline d-sm-none mr-2"
                      >
                        <span>
                          <v-icon class="">mdi-close-circle</v-icon>
                          <span class="sr-only">Clear Search</span>
                        </span>
                      </v-btn>

                        <v-btn
                          id="search-button-clear"
                          color="primary"
                          text-color="white"
                          @click="clearSearchForm"
                          small
                          rounded
                          class="d-none d-sm-inline mr-1"
                        >
                          <span >
                            <v-icon small class='mr-1'>mdi-close-circle</v-icon>
			     Clear
                          </span>
                        </v-btn>

                      <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            id="search-button-sort"
                            color="primary"
                            small
                            rounded
                            v-on="on"
                            class="d-none d-sm-inline mr-1"
                          >
                            <v-icon small class="mx-1">fas fa-sort</v-icon>
                            Sort
                          </v-btn>
                        </template>
                        <v-list min-width="200">
                          <v-list-item-group
                            v-model="input.sort"
                            color="primary"
                            mandatory
                          >
                            <v-list-item
                              v-for="(item, index) in sorts"
                              :key="item.field"
                              @click="resort(item.field)"
                              :value="item.field"
                            >
                              <v-list-item-title>{{
                                item.type
                              }}</v-list-item-title>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-menu>
                      <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            color="primary"
                            x-small
                            v-on="on"
                            fab
                            class="d-inline d-sm-none"
                          >
                            <v-icon small class="">fas fa-sort</v-icon>
                            <span class="sr-only">Sort</span>
                          </v-btn>
                        </template>
                        <v-list min-width="200">
                          <v-list-item-group
                            v-model="input.sort"
                            color="primary"
                          >
                            <v-list-item
                              v-for="(item, index) in sorts"
                              :key="item.field"
                              @click="resort(item.field)"
                              :value="item.field"
                            >
                              <v-list-item-title>{{
                                item.type
                              }}</v-list-item-title>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-menu>
                      <share
                        :url="encodeURI(shareUrl)"
                        label="Share"
                        small
                        show-copy
                        :hide="['email']"
                      />
                    </p>
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  sm="5"
                  class="py-1 px-1"
                  v-show="!isLoading && results.schools.length > 0"
                >
                  <div class="text-md-right justify-end">
                    <v-pagination
                      flat
                      v-model="input.page"
                      :length="totalPages"
                      :total-visible="7"
                      @input="handlePaginationInput"
                      class="pr-0 mr-0"
                      circle
                    ></v-pagination>
                  </div>
                </v-col>
              </v-row>
            </v-card>

              <!-- Instituition Information -->
              <div v-if="displayToggle === 'institutions' && !isLoading && this.displayFlag"
                   id="search-institutions-dolflag"
                   class="my-2"
              >
              <v-row>
                <v-col cols="12" sm="5" md="5" class="py-1 pl-3 pr-1">
                  <v-chip class="dolflag-chip" close @click:close="handleDOLFlag"><span>Only show schools that have programs that qualify for the Department of Labor's WIOA program.<tooltip definition="wioa-participants"/></span></v-chip>
                  </v-col>
                <v-col cols="12" sm="7" md="7" class="py-1 px-1">
                  <p class="white--text">
                    Learn more about the Department of Labor's WIOA program at 
                    <a target="_blank" href="https://collegescorecard.ed.gov/training" class="white--text" >
                      CollegeScorecard.ed.gov/training.
                    </a>

                  </p>
                </v-col>
                </v-row>
              </div>              

              <!-- Field Of Study CIP 4 Information -->
              <div 
                   id="search-fos-cip-warning"
                   class="my-2"
              >
              <v-row>
                <v-col cols="12" sm="5" md="5" class="py-1 pl-3 pr-1" v-if="displayToggle === 'fos' && !isLoading && this.displayFlag">
                  <v-chip class="dolflag-chip" close @click:close="handleDOLFlag">
                    <span>Only show schools that have programs that qualify for the Department of Labor's WIOA program.<tooltip definition="wioa-participants"/>
                  <br/>
                    Learn more about the Department of Labor's WIOA program at 
                    <a target="_blank" href="https://collegescorecard.ed.gov/training">
                      CollegeScorecard.ed.gov/training.
                    </a>
                    </span>                    
                  </v-chip>
                </v-col>
                <v-col cols="12" sm="7" md="7" class="py-1 px-1"  v-if="displayToggle === 'fos'">
                <p class="white--text pl-2">
                  <strong>Note:</strong> Field of Study titles are based on the US Department of Education's
                  Classification of Instructional Programs (CIP) and may not match the program titles at a
                  given school.
                  <a target="_blank" :href="$url('/school/transition/')"
                  @click="transitionOutboundLink($event, 'https://nces.ed.gov/ipeds/cipcode/Default.aspx?y=56')">
                    Learn more about CIP<v-icon
                      x-small
                      color="white"
                      class="pl-1"
                    >
                      fas fa-external-link-alt
                    </v-icon>

                  </a>
                </p>
                </v-col>
                </v-row>              
              </div>

            <!-- No Results/Canned Search/ -->
            <div
              id="search-can-query-container"
              v-if="!isLoading && results.schools.length === 0"
            >
              <v-row>
                <v-col cols="12" v-if="displayToggle === 'institutions'">
                  <v-card class="pa-5">
                    <h3>Show Me Options</h3>
                    <p>
                      Select one or more options below to create a list of
                      schools that fit your needs.
                    </p>
                    <canned-search-container
                      @canned-search-submit="handleCannedSearchClick"
                    ></canned-search-container>
                  </v-card>
                </v-col>

                <v-col cols="12" v-if="displayToggle === 'fos'">
                  <v-card class="pa-5 text-center">
                    <h3 class="text-center">No Results Found</h3>
                    <br />
                    <v-btn
                      id="search-button-clear-filters"
                      color="primary"
                      text-color="white"
                      @click="clearSearchForm"
                    >
                      <span>
                        <v-icon class="mr-2">mdi-close-circle</v-icon> Clear
                        Search Filters
                      </span>
                    </v-btn>
                  </v-card>
                </v-col>
              </v-row>
            </div>

            <!-- Main Search Results -->
            <div class="results-main-alert">
              <!-- Loading -->
              <div class="show-loading mt-2" v-show="isLoading">
                <v-card class="py-4 px-4 pageBar">
                  <h1 class="title">
                    Loading
                    <v-icon color="#00365e">fas fa-circle-notch fa-spin</v-icon>
                  </h1>
                </v-card>
              </div>

              <!-- Search Query Error-->
              <div class="show-error" v-show="error.message">
                <h1>Something went wrong:</h1>
                <p class="error-message">{{ error.message }}</p>
              </div>

              <!-- Institution Results -->
              <div class="search-result-cards-container" v-if="!isLoading">
                <!-- Institution Results -->
                <v-row v-if="displayToggle === 'institutions'">
                  <v-col
                    v-for="school in results.schools"
                    :key="school.id"
                    cols="12"
                    lg="3"
                    md="4"
                    sm="6"
                    class="d-flex align-stretch"
                  >
                    <search-result-card :school="school" />
                  </v-col>
                </v-row>

                <!-- Fields of Study Results -->
                <v-row v-else>
                  <v-col
                    v-for="school in results.schools"
                    :key="school.id"
                    cols="12"
                    lg="12"
                    md="12"
                    sm="12"
                    class="d-flex align-stretch"
                  >
                    <fos-result-card
                      :school="school"
                      :selected-fields-of-study="compareFieldsOfStudy"
                    />
                  </v-col>
                </v-row>
              </div>

              <!-- Field of Study Results -->
              <div class="search-result-cards-container" v-else></div>
            </div>

            <!-- Bottom Pagination -->
            <v-card
              class="mt-4 mb-2 py-1 px-4 pageBar elevation-0"
              v-if="!isLoading && results.schools.length > 0"
            >
              <v-row>
                <v-col cols="12" class="py-3 px-3">
                  <div class="text-right">
                    <v-pagination
                      v-model="input.page"
                      :length="totalPages"
                      :total-visible="7"
                      @input="handlePaginationInput"
                      class="pr-0 mr-0"
                      circle                      
                    ></v-pagination>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </div>

        <!-- Floating Mobile Search Button -->
        <v-btn
          fab
          fixed
          right
          color="secondary"
          rounded
          @click="showSidebar = !showSidebar"
          v-if="$vuetify.breakpoint.mdAndDown"
          class="searchFab"
          title="Search"
        >
          <v-icon>fas fa-search</v-icon>
        </v-btn>
      </v-container>
    </v-main>
    <!--End of root -->
  </div>
</template>

<script>
// TODO - This needs major cleanup.  How can it be cleaned?, Seperate files for legacy Javascript items?

import SearchResultCard from "~/components/SearchResultCard.vue"
import SearchForm from "~/components/SearchForm.vue"
import CannedSearchButton from "~/components/CannedSearchButton.vue"
import CannedSearchContainer from "~/components/CannedSearchContainer.vue"
import Share from "~/components/Share.vue"
import NameAutocomplete from "~/components/NameAutocomplete.vue"
import URLHistory from "~/js/mixins/URLHistory.js"
import PrepareParams from "~/js/mixins/PrepareParams.js"
import ContextToggle from "~/components/ContextToggle.vue"
import SearchFieldsOfStudyForm from "~/components/SearchFieldsOfStudyForm.vue"
import FieldOfStudyResultCard from "~/components/FieldOfStudyResultCard.vue"
import Tooltip from "~/components/Tooltip.vue";
import AnalyticsEvents from "~/js/mixins/AnalyticsEvents.js"

import _ from "lodash"
import { apiGet } from "~/js/api.js"
import { fields } from "~/js/constants.js"

const querystring = require("querystring")

export default {
  components: {
    "search-result-card": SearchResultCard,
    "search-form": SearchForm,
    "canned-search-button": CannedSearchButton,
    "canned-search-container": CannedSearchContainer,
    share: Share,
    "name-autocomplete": NameAutocomplete,
    "context-toggle": ContextToggle,
    "search-fos-form": SearchFieldsOfStudyForm,
    "fos-result-card": FieldOfStudyResultCard,
    "tooltip": Tooltip,
  },
  mixins: [URLHistory, PrepareParams, AnalyticsEvents],
  props: {
    "page-permalink": String,
    states: Array,
    programs: Array,
    religiousAffiliations: Array,
    specializedMission: Object,
    defaultSort: {
      type: String,
      default: "threshold_earnings:desc",
    },
    isLoading: Boolean,
    compareSchools: Array,
    compareFieldsOfStudy: Array,
  },
  data() {
    return {
      showSidebar: true,
      sidebar: {controlRadio: "1",
        fixed: false,
        absolute: true,
      },
      results: {
        schools: [],
        meta: {
          total: 0,
        },
      },
      input: {
        sort: null,
        page: 1,
      },
      urlParsedParams: {},
      utility: {
        formDefault: {},
        initailized: false,
        sortFAB: null,
        previousParams: {},
      },
      error: {
        message: null,
      },
      showCompare: false,
      sorts: [
        { type: "Name", field: "name:asc" },
        { type: "Annual Cost", field: "avg_net_price:asc" },
        { type: "Graduation Rate", field: "completion_rate:desc" },
        { type: "% Earning More Than a High School Grad", field: "threshold_earnings:desc" },
      ],
      shareUrl: null,
      displayToggle: "institutions",
      controlTab: 1,
      controlRadio: "1",
      fieldOfStudyTotalCountWithoutRangeFilters: 0,
      displayFlag: false
    }
  },
  created() {
    // Copy default form input state.
    this.utility.formDefault = _.cloneDeep(this.input)

    this.urlParsedParams = this.parseURLParams()

    // Add sort to state if it exists
    this.input.sort = this.urlParsedParams.sort
      ? this.urlParsedParams.sort
      : this.defaultSort

    // if Page is in the url, add it here.
    this.input.page = this.urlParsedParams.page
      ? Number(this.urlParsedParams.page) + 1
      : 1

    // Set Toggle Value - Default to institutions
    if (
      typeof this.urlParsedParams.toggle === "undefined" ||
      this.urlParsedParams.toggle === "institutions"
    ) {
      this.displayToggle = "institutions"
      this.controlTab = 0
      this.controlRadio = "0"
    } else {
      this.displayToggle = "fos"
      this.controlTab = 1
      this.controlRadio = "1"
    }

    if (typeof this.urlParsedParams.dolflag === 'undefined' || this.urlParsedParams.dolflag === 'false' ){
        this.displayFlag = false;
    }
    else{
        this.displayFlag = true;
    }

    // Create Debounce function for this page.
    this.debounceSearchUpdate = _.debounce(function(params) {
      // this.searchAPI(params, true);
      if (this.displayToggle === "institutions") {
        this.handleInstitutionSearch(params)
      } else {
        this.handleFieldOfStudySearch(params)
      }
    }, 1000)
  },
  computed: {
    totalPages() {
      if (this.results.meta.per_page && this.results.meta.total) {
        let totalPages = this.results.meta.total / this.results.meta.per_page

        // return the maximum amount of pages if operation produces a float.
        return Math.ceil(totalPages)
      }
    },
    showFieldOfStudyWarning() {
      if (this.displayToggle !== "fos") {
        return false
      }

      if (this.isLoading) {
        return false
      }

      if (
        typeof this.utility.previousParams.fos_salary != "undefined" ||
        typeof this.utility.previousParams.fos_debt != "undefined"
      ) {
        return true
      }
    },
    fieldOfStudyRangeFiltersHidingCount() {
      // Total count minus showing count.
      if (
        this.fieldOfStudyTotalCountWithoutRangeFilters > 0 &&
        this.results.meta.total > 0
      ) {
        return (
          this.fieldOfStudyTotalCountWithoutRangeFilters -
          this.results.meta.total
        )
      } else {
        return 0
      }
    },
    contextRadioClass(){
      if(this.controlRadio === "1"){
        return "field-of-study-context-panel";
      }else{
        return "institution-context-panel";
      }
    },
    contextRadioSchoolStyle(){
      if(this.controlRadio === "1"){
        return "normal";
      }else{
        return "bold";
      }
    },
    contextRadioFOSStyle(){
      if(this.controlRadio === "1"){
        return "bold";
      }else{
        return "normal";
      }
    }
  },
  methods: {
    searchAPI(params = {}, returnFields = [], allPrograms = true) {
      // TODO - Clean this method up, It does way more than just SearchAPI.
      // Better Encapsulation.

      this.$emit("loading", true)

      this.error.message = null

      if (typeof params['dolflag'] === 'undefined' || params['dolflag'] === 'false' ){
          this.displayFlag = false;
      }
      else{
          this.displayFlag = true;
      }      

      // let poppingState = false;
      // let alreadyLoaded = false;

      //Add page and sort items into params.
      if (params.page === 0) {
        // Reset page when passed 0
        this.input.page = 1
      } else if (this.input.page >= 1) {
        // Use local page counter;
        // The API function off of a 0 index;
        params.page = this.input.page - 1
      }

      params.sort = this.input.sort ? this.input.sort : this.defaultSort

      let query = this.prepareParams(params)

      query.fields = returnFields

      //Ensure that toggle is not sent to API
      if (query.toggle) {
        delete query.toggle
      }

      // TODO: Need to remove this when API
      // is processing requests better
      if (allPrograms) {
        query["all_programs_nested"] = true
      }

      // Add toggle value + params
      let qs = this.generateQueryString({
        ...params,
        toggle: this.displayToggle,
      })

      history.replaceState(params, "search", qs)

      this.addURLToStorage(qs)

      let request = apiGet("/schools", query)
        .then((response) => {
          //console.log("loaded schools:", response.data)

          this.results.schools = response.data.results
          this.results.meta = response.data.metadata

          this.$emit("loading", false)
          this.shareUrl = window.location.href
        })
        .catch((error) => {
          console.warn("Error fetching search.")
          this.$emit("loading", false)

          this.results = {
            meta: {},
            schools: [],
          }
          if (error == "Error: Request aborted") {
            
          }
          else if (error.response.data.errors) {
            this.showError(error.response.data.errors[0])
          } else if (error.response.status === 500) {
            this.showError("API 500 Error")
          }
        })
    },
    queryAPI(params = {}) {
      // Generic API Query Method that returns API results
      let query = this.prepareParams(params)

      return apiGet("/schools", query)
    },
    showError(error) {
      // TODO: Loop through multiple error messages if needed.
      console.error("error:", error)

      if (error.message) {
        this.error.message = error.message
      } else {
        this.error.message = "There was an unexpected API error."
      }
    },
    handleCannedSearchClick(cannedSearchData) {
      if (cannedSearchData) {
        this.urlParsedParams = this.parseURLParams(
          this.generateQueryString(cannedSearchData).substr(1)
        )
      }
    },
    isResultCardSelected(schoolId, compareSchools) {
      if (_.findIndex(compareSchools, ["schoolId", String(schoolId)]) >= 0) {
        return true
      }
      return false
    },
    parseURLParams(url) {
      if (!url && process.isClient) {
        url = location.search.substr(1)
      }
      let query = querystring.parse(url)

      return query || {}
    },
    generateQueryString(params) {
      let qs = querystring.stringify(params)
      return (
        "?" +
        qs
          .replace(/^&+/, "")
          .replace(/&{2,}/g, "&")
          .replace(/%3A/g, ":")
      )
    },
    resort(sort) {
      this.input.sort = sort
      var params =this.parseURLParams()
      this.debounceSearchUpdate(params)
    },
    clearSearchForm() {
      this.input = {
        page: 1,
        sort: this.defaultSort,
      }
      this.urlParsedParams = {}
      this.$root.$emit("search-form-reset")
    },
    handleContextToggle(toggleValue) {
      this.clearSearchForm()
      this.controlTab = toggleValue
      this.displayToggle = toggleValue === 0 ? "institutions" : "fos"
      this.results.schools = []
      this.results.meta = {
        total: 0,
      }
      // TODO - What happens to search filters?
    },
    handleContextToggleTwo(toggleValue){
      this.clearSearchForm();
      this.displayToggle = (toggleValue === "1")? 'fos' : 'institutions';
      this.results.schools = []
      this.results.meta = {
        total: 0
      }
      // TODO - What happens to search filters?
    },
    handleInstitutionSearch(params) {
      let returnFields = [
        // we need the id to link it
        fields.ID,
        // basic display fields
        fields.NAME,
        fields.CITY,
        fields.STATE,
        fields.SIZE,
        fields.BRANCHES,
        fields.LOCALE,
        // to get "public" or "private"
        fields.OWNERSHIP,
        // to get the "four_year" or "lt_four_year" bit
        fields.PREDOMINANT_DEGREE,
        // program-reporter offered programs / flag
        fields.PROGRAM_REPORTER_OFFERED,
        // get all of the net price values
        fields.NET_PRICE,
        // completion rate
        fields.COMPLETION_RATE,
        // this has no sub-fields
        fields.MEDIAN_EARNINGS,
        // not sure if we need this, but let's get it anyway
        fields.EARNINGS_GT_25K,
        // under investigation flag
        fields.UNDER_INVESTIGATION,

        // new completion rates
        fields.COMPLETION_OM,
        fields.COMPLETION_150_4,
        fields.COMPLETION_150_LT4,    

        fields.FIELD_OF_STUDY,
      ].join(",")
      
      this.searchAPI(params, returnFields)
    },
    handleFieldOfStudySearch(params) {
      // TODO - refine fields
      let returnFields = [
        fields.ID,
        // basic display fields
        fields.NAME,
        fields.CITY,
        fields.STATE,
        fields.SIZE,
        // Degree size
        fields.PREDOMINANT_DEGREE,
        // to get "public" or "private"
        fields.OWNERSHIP,
        // under investigation flag
        fields.UNDER_INVESTIGATION,
        fields.LOCALE,
        fields.FIELD_OF_STUDY,
      ].join(",")

      // Cache params to power other content
      this.utility.previousParams = params

      this.searchAPI(params, returnFields, false)
    },
    handlePaginationInput() {
      if (this.displayToggle === "fos") {
        this.handleFieldOfStudySearch(this.parseURLParams())
      } else {
        this.handleInstitutionSearch(this.parseURLParams())
      }
    },
    handleDOLFlag() {
      this.urlParsedParams = this.parseURLParams()
      delete this.urlParsedParams.dolflag
      this.debounceSearchUpdate(this.urlParsedParams)
      this.$root.$emit('reset-dol-flag')

      
    }
  },
 metaInfo: {
    title: 'Search',
    meta: [
      {
        key: 'og:title',
        name: 'og:title',
        content: "Search | College Scorecard"
      },     
      {
        key: 'twitter:title',
        name: 'twitter:title',
        content: "Search | College Scorecard"
      },       
    ]     
  }
};
</script>
