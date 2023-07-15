import { PostgrestSingleResponse } from '@supabase/supabase-js';

const errorFilter = <T>(response: PostgrestSingleResponse<T>) => {
  if (response.error !== null) throw new Error('error filter caught something');

  return response;
};

export default errorFilter;
