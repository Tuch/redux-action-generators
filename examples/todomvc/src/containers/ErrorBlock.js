import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../actions';

const mapStateToProps = state => ({
  error: state.todos.error,
});

class ErrorBlock extends PureComponent {
  static propTypes = {
    error: PropTypes.object,
    loadTodos: PropTypes.func.isRequired,
  };

  static defaultProps = {
    error: null,
  };

  render() {
    const { error, loadTodos } = this.props;

    return error ? (
      <div className="error-block">
        <div className="error-block__text">{error.text}</div>
        <button
          className="error-block__reload"
          onClick={loadTodos}
          type="button"
        >
          &#8635;
        </button>
      </div>
    ) : null;
  }
}

export default connect(
  mapStateToProps,
  actions,
)(ErrorBlock);
