import { PostgrestSingleResponse } from '@supabase/supabase-js';

const errorFilter = <T>(response: PostgrestSingleResponse<T>) => {
  if (response.error !== null) {
    throw new Error(response.error.message);
  }

  return response;
};

export default errorFilter;
