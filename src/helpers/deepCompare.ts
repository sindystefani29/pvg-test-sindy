import { OptionTypes } from "@/route/hooks/useFetch/types";


export default function deepCompare(prevValue: Partial<OptionTypes['variables']>, currentValue: Partial<OptionTypes['variables']>){
    let result = true

    if(Object.keys(prevValue).length === Object.keys(currentValue).length){
        for(const key in prevValue){
            //@ts-ignore:  No index signature with a parameter of type 'string' was found on type 'Partial<SearchParams>'
            //todo : recheck if SearchParams is an object or string
            if(prevValue[key] !== currentValue[key]){
                result = false
            }
        }
    }else{
        result = false
    }

    return result
}