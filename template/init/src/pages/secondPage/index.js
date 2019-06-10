import component from './component';
import reducers from './reducers';
import { commonService } from '@common/service';

commonService.registReducer(reducers);

export default component;