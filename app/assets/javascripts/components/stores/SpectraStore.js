import base64 from 'base-64';
import { FN } from 'react-spectra-viewer';

import alt from '../alt';
import SpectraActions from '../actions/SpectraActions';

class SpectraStore {
  constructor() {
    this.jcamp = null;
    this.spcInfo = null;
    this.showModal = false;
    this.fetched = false;
    this.predictions = {
      outline: {},
      output: { result: [] },
    };

    this.bindListeners({
      handleToggleModal: SpectraActions.ToggleModal,
      handleLoadSpectra: SpectraActions.LoadSpectra,
      handleSaveToFile: SpectraActions.SaveToFile,
      handleRegenerate: SpectraActions.Regenerate,
      handleInferSpectrum: SpectraActions.InferSpectrum,
    });
  }

  decodeSpectrum(target) {
    const { files } = target;
    if (!files) return [];
    const jcamps = files.map((f) => {
      try {
        const raw = base64.decode(f.file);
        const file = FN.ExtractJcamp(raw);
        if (!file.spectrum) return null;
        return Object.assign({}, f, { file });
      } catch (err) {
        return null;
      }
    }).filter(r => r != null);
    if (!jcamps) return [];
    const { predictions } = files[0];
    if (predictions.outline && predictions.outline.code) {
      return { jcamp: jcamps[0], predictions };
    }
    return {
      jcamp: jcamps[0],
      predictions: {
        outline: {},
        output: { result: [] },
      },
    };
  }

  handleToggleModal() {
    this.setState({
      jcamp: null,
      spcInfo: null,
      showModal: !this.showModal,
      fetched: false,
    });
  }

  handleLoadSpectra({ target, spcInfo }) {
    const { jcamp, predictions } = this.decodeSpectrum(target);
    this.setState({
      spcInfo, jcamp, predictions, fetched: true,
    });
  }

  handleSaveToFile() {
    // no further process needed.
  }

  handleRegenerate() {
    // no further process needed.
  }

  handleInferSpectrum(predictions) {
    this.setState({ predictions });
  }
}

export default alt.createStore(SpectraStore, 'SpectraStore');
