import cip_2_digit from "~/data/cip_2_digit.json";
import cip_4_digit from "~/data/cip_4_digit.json";
import glossary from "~/data/glossary.json";
import race_ethnicity from "~/data/race_ethnicity.json";
import religious_affiliations from "~/data/religious_affiliations.json";
import special_designations from "~/data/special_designations.json";
import states from "~/data/states.json";
import cip_6_digit from "~/data/cip_6_test.json";
import repayment_rates from "~/data/repayment_rates.json"

export const SiteData = {
  computed:{
    RELIGIOUS_AFFILIATIONS_BY_NUMBER(){
      return this.site.data.religious_affiliations.reduce( function(object,value){
        object[value.value] = value.label;
        return object;
      }, {});
    },
    CIP2(){
      return this.site.data.cip_2_digit.reduce( function(object,value){
        object[value.label] = value.value;
        return object;
      }, {});
    },
    CIP4(){
      return this.site.data.cip_4_digit.map(function(value,key){
        return {cip4: value.label, field: value.value.replace('.','')}
      });
    }

  },
  data(){
    return {
      site:{
        data: {
          cip_2_digit: cip_2_digit,
          cip_4_digit: cip_4_digit,
          cip_6_digit: cip_6_digit,
          glossary: glossary,
          race_ethnicity: race_ethnicity,
          religious_affiliations: religious_affiliations,
          special_designations: special_designations,
          states: states,
          repayment_rates: repayment_rates,
        }
      }
    };
  },
  methods:{
    locateCip4Field(cip4Code){
      let formattedCip4Code = cip4Code.toString();

      // Grab code
      let cip4Object = this.CIP4.find((cip4Object) => {
        // Check for code, removing `.`;
        return cip4Object.cip4.replace(/\./g,'') === formattedCip4Code.replace(/\./g,'');
      });

      if(cip4Object && cip4Object.field){
        return cip4Object.field;
      }else{
        return null;
      }
    },
    findAllCip6fromCip4(cip4Code){
      return this.site.data.cip_6_digit.filter((cip6) => {
        return Number(cip6.code.slice(0,4)) === Number(cip4Code);
      })
    }
  }
};