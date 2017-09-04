import 'whatwg-fetch';
import Sample from '../models/Sample';
import Reaction from '../models/Reaction';
import Wellplate from '../models/Wellplate';
import Screen from '../models/Screen';

export default class SearchFetcher {
  static fetchBasedOnSearchSelectionAndCollection(
      selection, collectionId, currentPage = 1,
      isSync = false, moleculeSort = false) {
    let promise = fetch('/api/v1/search/' + selection.elementType.toLowerCase(), {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selection: selection,
          collection_id: collectionId,
          page: currentPage,
          per_page: selection.page_size,
          is_sync: isSync,
          molecule_sort: moleculeSort ? 1 : 0,
        })
      })
      .then((response) => {
        return response.json()
      }).then((json) => {
        let sampleElements = json.samples.totalElements > 0
          ? json.samples.elements.molecules.map( m => {
            return m.samples.map( s => new Sample(s) )
          }) : [];
        let samples = {
          elements: sampleElements,
          totalElements: json.samples.totalElements,
          page: json.samples.page,
          pages: json.samples.pages,
          perPage: json.samples.per_page,
          ids: json.samples.ids
        }
        let reactions = {
          elements: json.reactions.elements.map((r) => new Reaction(r)),
          totalElements: json.reactions.totalElements,
          page: json.reactions.page,
          pages: json.reactions.pages,
          perPage: json.reactions.per_page,
          ids: json.reactions.ids
        }
        let wellplates = {
          elements: json.wellplates.elements.map((w) => new Wellplate(w)),
          totalElements: json.wellplates.totalElements,
          page: json.wellplates.page,
          pages: json.wellplates.pages,
          perPage: json.wellplates.per_page,
          ids: json.wellplates.ids
        }
        let screens = {
          elements: json.screens.elements.map((s) => new Screen(s)),
          totalElements: json.screens.totalElements,
          page: json.screens.page,
          pages: json.screens.pages,
          perPage: json.screens.per_page,
          ids: json.screens.ids
        }

        return {
          samples: samples,
          reactions: reactions,
          wellplates: wellplates,
          screens: screens
        };
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });

    return promise;
  }
}
