import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Avatar, CircularProgress } from '@mui/material';
import axios from 'axios';

export default function CountrySelect({ value, onChange }) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    // fetch once
    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all?fields=name,flags,currencies,cca2')
            .then(res =>
                setOptions(res.data
                    .map(c => ({
                        code: c.cca2,
                        name: c.name.common,
                        currency: Object.keys(c.currencies || {})[0] || 'N/A',
                        flag: c.flags.svg
                    }))
                    .sort((a,b)=>a.name.localeCompare(b.name))
                )
            )
            .finally(()=>setLoading(false));
    }, []);

    const getOptionLabel = o => o ? `${o.name} (${o.currency})` : '';

    return (
        <Autocomplete
            options={options}
            loading={loading}
            value={value}
            onChange={(_e,newVal)=>onChange(newVal)}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={(o,v)=>o.code===v.code}
            renderOption={(props, option) => (
                <li {...props} key={option.code}>
                    <Avatar
                        src={option.flag}
                        sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    {getOptionLabel(option)}
                </li>
            )}
            /* renderInput stays the same */
            renderInput={params => (
                <TextField
                    {...params}
                    label="Country"
                    required
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress size={18} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        )
                    }}
                />
            )}
        />
    );
}
