import Grid from "@mui/material/Grid";
import StyledInput from "../../../Components/Theme/Fields/StyledInput";
import SelectField from "../../../Components/Theme/Fields/SelectField";
import {AutocompleteWithChips} from "../../../Components/Theme/Fields/AutocompleteWithChips";
import {Card} from "../../../Components/Theme/Components/Card";
import CreateZVTable from "./CreateZVTable";
import {useZvSettingsQuery} from "../api";
import { useTranslation } from "react-i18next";

const CreateZV = ({params, setParams, aggregation, setAggregation, error, setClearProperties}) => {
  const {t} = useTranslation();
  const {data: {aggregation_types = [], properties = []} = {}} = useZvSettingsQuery();

  const handleOnChange = (filter) => {
    return (value) => {
      switch (filter) {
        case 'name':
          setAggregation({...aggregation, [filter]: value.target.value});
          break;
        case 'properties':
          setAggregation({...aggregation, [filter]: value.map(i => i.value)});
          break;
        default:
          setAggregation({...aggregation, [filter]: value});
      }
    };
  };

  return (
    <>
      <Card title={t('PAGES.CREATE_ZV')}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={8}>
            <StyledInput
              label={t('FIELDS.AGREGATION_NAME')}
              value={aggregation.name}
              onChange={handleOnChange('name')}
              max={250}
              error={error?.data?.name}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <SelectField
              label={t('FIELDS.AGREGATION_TYPE')}
              dataMarker={'aggregation_types'}
              value={aggregation.aggregation_type}
              data={aggregation_types}
              onChange={handleOnChange('aggregation_type')}
              error={error?.data?.aggregation_type?.[0]}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <StyledInput
              label={t('FIELDS.DATA_DIMENSIONALITY')}
              value={'РТ60М'}
              readOnly={true}
            />
          </Grid>
        </Grid>
      </Card>
      <Card title={t('CHARACTERISTICS_FOR_AGGERGATION')}>
        <AutocompleteWithChips
          options={properties?.map(i => ({...i, label: i?.description}))}
          label={t('FIELDS.CHARACTERISTICS')}
          textNoMoreOption={t('NO_MORE_CAHRACTERISTICT_TO_SELECT')}
          handleChange={handleOnChange('properties')}
          setClearProperties={setClearProperties}
          error={error?.data?.properties?.non_field_errors}
        />
      </Card>
      <CreateZVTable
        params={params}
        setParams={setParams}
        loading={false}
        aggregation={aggregation}
      />
    </>
  );
}

export default CreateZV;