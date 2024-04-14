import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StockService } from 'src/app/core/services/stock.service';
import { FilterStateModel } from './filter.model';
import { Filters } from './filter.actions';


@Injectable()
@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    filters: [],
    apiResponse: null,
  }
})
export class StockState {
  @Selector()
  static selectedFilters(state: FilterStateModel){
    return state.filters;
  }

  @Action(Filters)
  filters(ctx: StateContext<FilterStateModel>, action: Filters) {
    console.log(action.filters)
    ctx.patchState({
      filters: action.filters
    });
  }

}
