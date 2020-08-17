import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
/*eslint-disable*/

const DEFAULT_PLACEHOLDER_STRING = 'Select...';

class ReactDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.parseValue(props.value, props.options) || {
        label: typeof props.placeholder === 'undefined' ? DEFAULT_PLACEHOLDER_STRING : props.placeholder,
        value: '',
        pace: typeof props.pace === 'undefined' ? '' : props.pace,
        productId: typeof props.productId === 'undefined' ? '' : props.productId
      },
      isOpen: false
    };
    this.mounted = true;
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.fireChangeEvent = this.fireChangeEvent.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value) {
      var selected = this.parseValue(newProps.value, newProps.options);
      if (selected !== this.state.selected) {
        this.setState({ selected: selected });
      }
    } else {
      this.setState({
        selected: {
          label: typeof newProps.placeholder === 'undefined' ? DEFAULT_PLACEHOLDER_STRING : newProps.placeholder,
          value: '',
          pace: typeof newProps.pace === 'undefined' ? '' : newProps.pace,
          productId: typeof newProps.pace === 'undefined' ? '' : newProps.productId
        }
      });
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, false);
  }

  handleMouseDown(event) {
    if (this.props.onFocus && typeof this.props.onFocus === 'function') {
      this.props.onFocus(this.state.isOpen);
    }
    if (event.type === 'mousedown' && event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();

    if (!this.props.disabled) {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }

  parseValue(value, options) {
    let option;

    if (typeof value === 'string') {
      for (var i = 0, num = options.length; i < num; i++) {
        if (options[i].type === 'group') {
          const match = options[i].items.filter(item => item.value === value);
          if (match.length) {
            option = match[0];
          }
        } else if (typeof options[i].value !== 'undefined' && options[i].value === value) {
          option = options[i];
        }
      }
    }

    return option || value;
  }

  setValue(value, label, pace, productId) {
    let newState = {
      selected: {
        value,
        label,
        pace,
        productId,
      },
      isOpen: false
    };
    this.fireChangeEvent(newState);
    this.setState(newState);
  }

  fireChangeEvent(newState) {
    if (newState.selected !== this.state.selected && this.props.onChange) {
      this.props.onChange(newState.selected);
    }
  }

  renderOption(option) {
    let value = option.value;
    if (typeof value === 'undefined') {
      value = option.label || option;
    }
    let label = option.label || option.value || option;
    let pace = option.pace || '';
    let productId = option.productId || '';
    let isSelected = value === this.state.selected.value || value === this.state.selected;

    const classes = {
      [`${this.props.baseClassName}-option`]: true,
      [option.className]: !!option.className,
      'is-selected': isSelected
    };

    const optionClass = classNames(classes);

    return (
      <div
        key={value}
        className={optionClass}
        onMouseDown={this.setValue.bind(this, value, label, pace, productId)}
        onClick={this.setValue.bind(this, value, label, pace, productId)}
        role="option"
        aria-selected={isSelected ? 'true' : 'false'}
        dangerouslySetInnerHTML={this.createMarkup(label)}
      ></div>
    );
  }

  buildMenu() {
    let { options, baseClassName } = this.props;
    let ops = options.map(option => {
      if (option.type === 'group') {
        let groupTitle = <div className={`${baseClassName}-title`}>{option.name}</div>;
        let _options = option.items.map(item => this.renderOption(item));

        return (
          <div className={`${baseClassName}-group`} key={option.name} role="listbox" tabIndex="-1">
            {groupTitle}
            {_options}
          </div>
        );
      } else {
        return this.renderOption(option);
      }
    });

    return ops.length ? ops : <div className={`${baseClassName}-noresults`}>No options found</div>;
  }

  handleDocumentClick(event) {
    if (this.mounted) {
      if (!ReactDOM.findDOMNode(this).contains(event.target)) {
        if (this.state.isOpen) {
          this.setState({ isOpen: false });
        }
      }
    }
  }

  isValueSelected() {
    return typeof this.state.selected === 'string' || this.state.selected.value !== '';
  }

  createMarkup(value) {
    return { __html: value };
  }

  render() {
    const {
      baseClassName,
      controlClassName,
      placeholderClassName,
      menuClassName,
      arrowClassName,
      arrowClosed,
      arrowOpen,
      className,
    } = this.props;

    const disabledClass = this.props.disabled ? 'Dropdown-disabled' : '';
    const placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.label;

    const dropdownClass = classNames({
      [`${baseClassName}-root`]: true,
      [className]: !!className,
      'is-open': this.state.isOpen
    });
    const controlClass = classNames({
      [`${baseClassName}-control`]: true,
      [controlClassName]: !!controlClassName,
      [disabledClass]: !!disabledClass
    });
    const placeholderClass = classNames({
      [`${baseClassName}-placeholder`]: true,
      [placeholderClassName]: !!placeholderClassName,
      'is-selected': this.isValueSelected()
    });
    const menuClass = classNames({
      [`${baseClassName}-menu`]: true,
      [menuClassName]: !!menuClassName
    });
    const arrowClass = classNames({
      [`${baseClassName}-arrow`]: true,
      [arrowClassName]: !!arrowClassName
    });

    const value = (
      <div className={placeholderClass} dangerouslySetInnerHTML={this.createMarkup(placeHolderValue)}></div>
    );
    const menu = this.state.isOpen ? (
      <div className={menuClass} aria-expanded="true">
        {this.buildMenu()}
      </div>
    ) : null;

    return (
      <div className={dropdownClass}>
        <div
          className={controlClass}
          onMouseDown={this.handleMouseDown.bind(this)}
          onTouchEnd={this.handleMouseDown.bind(this)}
          aria-haspopup="listbox"
        >
          {value}
          <div className={`${baseClassName}-arrow-wrapper`}>
            {/* {arrowOpen && arrowClosed ? this.state.isOpen ? arrowOpen : arrowClosed : <span className={arrowClass} />} */}
            <svg xmlns="http://www.w3.org/2000/svg" width="9.4" height="8"><path d="M4.2 1.944L1.766 6h4.868L4.2 1.944M4.2 0l4.2 7H0l4.2-7z" fill="#E50847" transform="matrix(-1 0 0 -1 8.4 7)"/></svg>
          </div>
        </div>
        {menu}
      </div>
    );
  }
}

ReactDropdown.defaultProps = { baseClassName: 'Dropdown' };
export default ReactDropdown;