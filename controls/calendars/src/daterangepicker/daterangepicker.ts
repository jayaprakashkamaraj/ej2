/// <reference path='../calendar/calendar-model.d.ts'/>
import { Property, EventHandler, Internationalization, NotifyPropertyChanges, detach, getUniqueID } from '@syncfusion/ej2-base';
import { KeyboardEvents, BaseEventArgs, KeyboardEventArgs, Event, EmitType, Browser, L10n, ChildProperty } from '@syncfusion/ej2-base';
import { addClass, createElement, remove, closest, select, prepend, removeClass, attributes, Collection } from '@syncfusion/ej2-base';
import { isNullOrUndefined, isUndefined, formatUnit, setValue, rippleEffect, merge, extend } from '@syncfusion/ej2-base';
import { CalendarView, CalendarBase, NavigatedEventArgs, RenderDayCellEventArgs } from '../calendar/calendar';
import { Popup } from '@syncfusion/ej2-popups';
import { Button } from '@syncfusion/ej2-buttons';
import { Input, InputObject, FloatLabelType, FocusEventArgs, BlurEventArgs } from '@syncfusion/ej2-inputs';
import { ListBase, cssClass as ListBaseClasses } from '@syncfusion/ej2-lists';
import { PresetsModel, DateRangePickerModel } from './daterangepicker-model';

const DATERANGEWRAPPER: string = 'e-date-range-wrapper';
const INPUTCONTAINER: string = 'e-input-group';
const DATERANGEICON: string = 'e-input-group-icon e-range-icon e-icons';
const POPUP: string = 'e-popup';
const LEFTCALENDER: string = 'e-left-calendar';
const RIGHTCALENDER: string = 'e-right-calendar';
const LEFTCONTAINER: string = 'e-left-container';
const RIGHTCONTAINER: string = 'e-right-container';
const ROOT: string = 'e-daterangepicker';
const ERROR: string = 'e-error';
const ACTIVE: string = 'e-active';
const STARTENDCONTAINER: string = 'e-start-end';
const STARTDATE: string = 'e-start-date';
const ENDDATE: string = 'e-end-date';
const STARTBUTTON: string = 'e-start-btn';
const INPUTFOCUS: string = 'e-input-focus';
const ENDBUTTON: string = 'e-end-btn';
const RANGEHOVER: string = 'e-range-hover';
const OTHERMONTH: string = 'e-other-month';
const STARTLABEL: string = 'e-start-label';
const ENDLABEL: string = 'e-end-label';
const DISABLED: string = 'e-disabled';
const SELECTED: string = 'e-selected';
const CALENDAR: string = 'e-calendar';
const NEXTICON: string = 'e-next';
const PREVICON: string = 'e-prev';
const HEADER: string = 'e-header';
const TITLE: string = 'e-title';
const ICONCONTAINER: string = 'e-icon-container';
const RANGECONTAINER: string = 'e-date-range-container';
const RANGEHEADER: string = 'e-range-header';
const PRESETS: string = 'e-presets';
const FOOTER: string = 'e-footer';
const RANGEBORDER: string = 'e-range-border';
const TODAY: string = 'e-today';
const FOCUSDATE: string = 'e-focused-date';
const CONTENT: string = 'e-content';
const DAYSPAN: string = 'e-day-span';
const WEEKNUMBER: string = 'e-week-number';
const DATEDISABLED: string = 'e-date-disabled';
const ICONDISABLED: string = 'e-icon-disabled';
const CALENDARCONTAINER: string = 'e-calendar-container';
const SEPARATOR: string = 'e-separator';
const APPLY: string = 'e-apply';
const CANCEL: string = 'e-cancel';
const DEVICE: string = 'e-device';
const OVERLAY: string = 'e-overlay';
const CHANGEICON: string = 'e-change-icon e-icons';
const LISTCLASS: string = ListBaseClasses.li;
const RTL: string = 'e-rtl';
const HOVER: string = 'e-hover';
const OVERFLOW: string = 'e-range-overflow';
const OFFSETVALUE: number = 4;
const PRIMARY: string = 'e-primary';
const FLAT: string = 'e-flat';
const CSS: string = 'e-css';

export class Presets extends ChildProperty<Presets> {
    /** 
     * Defines the label string of the preset range. 
     */
    @Property()
    public label: string;
    /** 
     * Defines the start date of the preset range.
     */
    @Property()
    public start: Date;
    /** 
     * Defines the end date of the preset range 
     */
    @Property()
    public end: Date;
}

export interface DateRange {
    /** Defines the start date */
    start?: Date;
    /** Defines the end date */
    end?: Date;
}
export interface RangeEventArgs extends BaseEventArgs {
    /** Defines the value */
    value?: Date[] | DateRange;
    /** Defines the value string in the input element */
    text?: string;
    /** Defines the start date  */
    startDate?: Date;
    /** Defines the end date  */
    endDate?: Date;
    /** Defines the day span between the range */
    daySpan?: number;
    /** Specifies the element. */
    element?: HTMLElement | HTMLInputElement;
    /**
     * Specifies the original event arguments.
     */
    event?: MouseEvent | KeyboardEvent | TouchEvent | Event;
    /** 
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted?: boolean;
}

export interface RangePopupEventArgs {

    /** Defines the range string in the input element */
    date: string;
    /** Defines the DateRangePicker model */
    model: DateRangePickerModel;

    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel?: boolean;

    /** Defines the DatePicker popup object. */
    popup?: Popup;

    /**
     * Specifies the original event arguments.
     */

    event?: MouseEvent | KeyboardEvent | Event;
    /**
     * Specifies the node to which the popup element to be appended.
     */
    appendTo?: HTMLElement;
}


/**
 * Represents the DateRangePicker component that allows user to select the date range from the calendar
 * or entering the range through the input element.
 * ```html
 * <input id="daterangepicker"/>
 * ```
 * ```typescript
 * <script>
 *   var dateRangePickerObj = new DateRangePicker({ startDate: new Date("05/07/2017"), endDate: new Date("10/07/2017") });
 *   dateRangePickerObj.appendTo("#daterangepicker");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class DateRangePicker extends CalendarBase {
    private popupObj: Popup;
    private inputWrapper: InputObject;
    private popupWrapper: HTMLElement;
    private rightCalendar: HTMLElement;
    private leftCalendar: HTMLElement;
    private deviceCalendar: HTMLElement;
    private leftCalCurrentDate: Date;
    private initStartDate: Date;
    private initEndDate: Date;
    private startValue: Date;
    private endValue: Date;
    private modelValue: Date[] | DateRange;
    private rightCalCurrentDate: Date;
    private leftCalPrevIcon: HTMLElement;
    private leftCalNextIcon: HTMLElement;
    private leftTitle: HTMLElement;
    private rightTitle: HTMLElement;
    private rightCalPrevIcon: HTMLElement;
    private rightCalNextIcon: HTMLElement;
    private inputKeyboardModule: KeyboardEvents;
    protected leftKeyboardModule: KeyboardEvents;
    protected rightKeyboardModule: KeyboardEvents;
    private previousStartValue: Date;
    private previousEndValue: Date;
    private applyButton: Button;
    private cancelButton: Button;
    private startButton: Button;
    private endButton: Button;
    private cloneElement: HTMLElement;
    private l10n: L10n;
    private isCustomRange: boolean = false;
    private isCustomWindow: boolean = false;
    private presetsItem: { [key: string]: Object }[] = [];
    private liCollections: HTMLElement[] = [];
    private activeIndex: number;
    private presetElement: HTMLElement;
    private previousEleValue: string = '';
    private targetElement: HTMLElement;
    private disabledDayCnt: number;
    private angularTag: string;
    private inputElement: HTMLInputElement;
    private modal: HTMLElement;
    private firstHiddenChild: HTMLInputElement;
    private secondHiddenChild: HTMLInputElement;
    private isKeyPopup: boolean = false;
    private dateDisabled: boolean = false;
    private navNextFunction: Function;
    private navPrevFunction: Function;
    private deviceNavNextFunction: Function;
    private deviceNavPrevFunction: Function;
    private isRangeIconClicked: boolean = false;
    private isMaxDaysClicked: boolean = false;
    private popupKeyboardModule: KeyboardEvents;
    private presetKeyboardModule: KeyboardEvents;
    private btnKeyboardModule: KeyboardEvents;
    private virtualRenderCellArgs: RenderDayCellEventArgs;
    private disabledDays: Date[] = [];
    private isMobile: boolean;
    private presetKeyConfig: { [key: string]: string };
    private keyInputConfigs: { [key: string]: string };
    private defaultConstant: Object;
    private preventBlur: boolean = false;
    private preventFocus: boolean = false;
    private valueType: Date[] | DateRange;
    private closeEventArgs: RangePopupEventArgs;
    private openEventArgs: RangePopupEventArgs;
    private controlDown: KeyboardEventArgs;
    private formElement: Element;

    /**
     * Gets or sets the start and end date of the Calendar.
     * @default null
     */
    @Property(null)
    public value: Date[] | DateRange;


    /** 
     * Enable or disable the persisting component's state between the page reloads. If enabled, following list of states will be persisted.
     * 1. startDate
     * 2. endDate
     * 3. value
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;
    /** 
     * Specifies the DateRangePicker in RTL mode that displays the content in the right-to-left direction.
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;
    /**
     * Gets or sets the minimum date that can be selected in the calendar-popup.
     * @default new Date(1900, 00, 01)
     */
    @Property(new Date(1900, 0, 1))
    public min: Date;
    /**
     * Gets or sets the maximum date that can be selected in the calendar-popup.
     * @default new Date(2099, 11, 31)
     */
    @Property(new Date(2099, 11, 31))
    public max: Date;
    /** 
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     * @default 'en-US'
     */
    @Property(null)
    public locale: string;
    /**
     * Gets or sets the Calendar's first day of the week. By default, the first day of the week will be based on the current culture.
     * > For more details about firstDayOfWeek refer to 
     * [`First day of week`](./how-to.html#change-the-first-day-of-the-week) documentation.
     * @default null
     */
    @Property(null)
    public firstDayOfWeek: number;
    /**
     * Determines whether the week number of the Calendar is to be displayed or not.
     * The week number is displayed in every week row.
     * > For more details about weekNumber refer to 
     * [`Calendar with week number`](./how-to.html#render-the-calendar-with-week-numbers)documentation.
     * @default false
     */
    @Property(false)
    public weekNumber: boolean;
    /** 
     * Triggers when Calendar is created.
     * @event 
     */
    @Event()
    public created: EmitType<Object>;
    /** 
     * Triggers when Calendar is destroyed.
     * @event 
     */
    @Event()
    public destroyed: EmitType<Object>;
    /**
     * Triggers when the Calendar value is changed.
     * @event  
     */
    @Event()
    public change: EmitType<RangeEventArgs>;
    /**
     * Triggers when the Calendar is navigated to another view or within the same level of view.
     * @event
     */
    @Event()
    public navigated: EmitType<NavigatedEventArgs>;
    /**     
     * Triggers when each day cell of the Calendar is rendered.
     * @event
     */
    @Event()
    public renderDayCell: EmitType<RenderDayCellEventArgs>;
    /**
     * Gets or sets the start date of the date range selection.
     * @default null
     */
    @Property(null)
    public startDate: Date;
    /**
     * Gets or sets the end date of the date range selection.
     * @default null
     */
    @Property(null)
    public endDate: Date;
    /**
     * Set the predefined ranges which let the user pick required range easily in a component.
     * > For more details refer to 
     * [`Preset Ranges`](./customization.html#preset-ranges) documentation.
     * @default null
     */
    @Collection<PresetsModel>([{}], Presets)
    public presets: PresetsModel[];
    /**
     * Specifies the width of the DateRangePicker component.
     * @default ''
     */
    @Property('')
    public width: number | string;
    /**
     * specifies the z-index value of the dateRangePicker popup element.
     * @default 1000
     * @aspType int
     */
    @Property(1000)
    public zIndex: number;

    /**
     * Specifies whether to show or hide the clear icon
     * @default true
     */
    @Property(true)
    public showClearButton: boolean;
    /** 
     * Specifies whether the today button is to be displayed or not.
     * @default true
     * @hidden
     */
    @Property(true)
    public showTodayButton: boolean;
    /** 
     * Specifies the initial view of the Calendar when it is opened.
     * With the help of this property, initial view can be changed to year or decade view.
     * @default Month
     * @hidden
     */
    @Property('Month')
    public start: CalendarView;
    /** 
     * Sets the maximum level of view (month, year, decade) in the Calendar.
     * Depth view should be smaller than the start view to restrict its view navigation.
     * @default Month
     * @hidden
     */
    @Property('Month')
    public depth: CalendarView;


    /**
     *  Sets the root CSS class to the DateRangePicker which allows you to customize the appearance.
     * @default ''    
     */
    @Property('')
    public cssClass: string;
    /**
     * Sets or gets the string that used between the start and end date string. 
     * @default '-'
     */
    @Property('-')
    public separator: string;
    /**
     *  Specifies the minimum span of days that can be allowed in date range selection.
     * > For more details refer to 
     * [`Range Span`] (./range-restriction.html#range-span) documentation.
     * @default null    
     */
    @Property(null)
    public minDays: number;
    /**
     *  Specifies the maximum span of days that can be allowed in a date range selection.
     * > For more details refer to 
     * [`Range Span`](./range-restriction.html#range-span) documentation.
     * @default null
     */
    @Property(null)
    public maxDays: number;
    /**
     * Specifies the component to act as strict which allows entering only a valid date range in a DateRangePicker.
     * > For more details refer to 
     * [`Strict Mode`](./range-restriction.html#strict-mode)documentation.
     * @default false
     */
    @Property(false)
    public strictMode: boolean;
    /**
     * Sets or gets the required date format to the start and end date string.
     * > For more details refer to 
     * [`Format`](https://ej2.syncfusion.com/demos/#/material/daterangepicker/format.html)sample.
     * @default null
     */
    @Property(null)
    public format: string;
    /**
     * Specifies the component to be disabled which prevents the DateRangePicker from user interactions. 
     * @default true
     */
    @Property(true)
    public enabled: boolean;
    /**
     * Denies the editing the ranges in the DateRangePicker component. 
     * @default false
     */
    @Property(false)
    public readonly: boolean;
    /**
     * Specifies whether the input textbox is editable or not. Here the user can select the value from the 
     * popup and cannot edit in the input textbox.
     * @default true
     */
    @Property(true)
    public allowEdit: boolean;

    /**
     * Specifies the placeholder text to be floated.
     * Possible values are:
     * Never: The label will never float in the input when the placeholder is available.
     * Always: The floating label will always float above the input.
     * Auto: The floating label will float above the input after focusing or entering a value in the input.
     * @default Syncfusion.EJ2.Inputs.FloatLabelType.Never
     * @aspType Syncfusion.EJ2.Inputs.FloatLabelType
     * @isEnumeration true
     */
    @Property('Never')
    public floatLabelType: FloatLabelType | string;
    /**
     * Specifies the placeholder text that need to be displayed in the DateRangePicker component.
     * 
     * @default null
     */
    @Property(null)
    public placeholder: string;

    /** 
     * Triggers when the DateRangePicker is opened.
     * @event 
     */
    @Event()
    public open: EmitType<Object>;

    /** 
     * Triggers when the DateRangePicker is closed.
     * @event 
     */
    @Event()
    public close: EmitType<Object>;
    /** 
     * Triggers on selecting the start and end date.
     * @event 
     */
    @Event()
    public select: EmitType<Object>;
    /** 
     *  Triggers when the control gets focus.
     * @event 
     */
    @Event()
    public focus: EmitType<FocusEventArgs>;
    /** 
     * Triggers when the control loses the focus.
     * @event 
     */
    @Event()
    public blur: EmitType<BlurEventArgs>;
    /**
     * Constructor for creating the widget
     */
    constructor(options?: DateRangePickerModel, element?: string | HTMLInputElement) {
        super(options, element);
    }
    /**
     * To Initialize the control rendering.
     * @return void
     * @private
     */
    protected render(): void {
        this.initialize();
        this.setProperties({ startDate: this.startValue }, true);
        this.setProperties({ endDate: this.endValue }, true);
        this.setModelValue();
    }
    /**
     * Initialize the event handler
     * @returns void
     * @private
     */
    protected preRender(): void {
        this.presetKeyConfig = {
            moveUp: 'uparrow',
            moveDown: 'downarrow',
            enter: 'enter',
            tab: 'tab',
            spacebar: 'space'
        };
        this.keyInputConfigs = {
            altDownArrow: 'alt+downarrow',
            escape: 'escape',
            enter: 'enter',
            tab: 'tab',
            altRightArrow: 'alt+rightarrow',
            altLeftArrow: 'alt+leftarrow'
        };
        this.defaultConstant = {
            placeholder: '',
            startLabel: 'Start Date',
            endLabel: 'End Date',
            customRange: 'Custom Range',
            applyText: 'Apply',
            cancelText: 'Cancel',
            selectedDays: 'Selected Days',
            days: 'days'
        };
        /**
         * Mobile View
         */
        this.isMobile = window.matchMedia('(max-width:550px)').matches;
        this.inputElement = <HTMLInputElement>this.element;
        this.angularTag = null;
        if (this.element.tagName === 'EJS-DATERANGEPICKER') {
            this.angularTag = this.element.tagName;
            this.inputElement = <HTMLInputElement>this.createElement('input');
            this.element.appendChild(this.inputElement);
        }
        this.cloneElement = <HTMLElement>this.element.cloneNode(true);
        if (this.element.getAttribute('id')) {
            if (this.angularTag !== null) { this.inputElement.id = this.element.getAttribute('id') + '_input'; }
        } else {
            this.element.id = getUniqueID('ej2-datetimepicker');
            if (this.angularTag !== null) { attributes(this.inputElement, { 'id': this.element.id + '_input' }); }
        }
        this.initProperty();
        super.preRender();
        this.navNextFunction = this.navNextMonth.bind(this);
        this.navPrevFunction = this.navPrevMonth.bind(this);
        this.deviceNavNextFunction = this.deviceNavNext.bind(this);
        this.deviceNavPrevFunction = this.deviceNavPrevious.bind(this);
        this.initStartDate = this.checkDateValue(this.startValue);
        this.initEndDate = this.checkDateValue(this.endValue);
        this.formElement = closest(this.element, 'form');
    };

    private updateValue(): void {
        if (this.value && (<Date[]>this.value).length > 0) {
            if ((<Date[]>this.value)[0] instanceof Date && !isNaN(+(<Date[]>this.value)[0])) {
                this.setProperties({ startDate: (<Date[]>this.value)[0] }, true);
                this.startValue = (<Date[]>this.value)[0];
            } else if (typeof (<Date[]>this.value)[0] === 'string') {
                if (+(<Date[]>this.value)[0] === 0 || isNaN(+(new Date('' + (<Date[]>this.value)[0])))) {
                    this.startValue = null;
                    this.setValue();
                } else {
                    this.setProperties({ startDate: new Date('' + (<Date[]>this.value)[0]) }, true);
                    this.startValue = new Date('' + (<Date[]>this.value)[0]);
                }
            } else {
                this.startValue = null;
                this.setValue();
            }
            if ((<Date[]>this.value)[1] instanceof Date && !isNaN(+(<Date[]>this.value)[1])) {
                this.setProperties({ endDate: (<Date[]>this.value)[1] }, true);
                this.endValue = (<Date[]>this.value)[1];
            } else if (typeof (<Date[]>this.value)[1] === 'string') {
                if (+(<Date[]>this.value)[0] === 0 || isNaN(+(new Date('' + (<Date[]>this.value)[0])))) {
                    this.setProperties({ endDate: null }, true);
                    this.endValue = null;
                    this.setValue();
                } else {
                    this.setProperties({ endDate: new Date('' + (<Date[]>this.value)[1]) }, true);
                    this.endValue = new Date('' + (<Date[]>this.value)[1]);
                    this.setValue();
                }
            } else {
                this.setProperties({ endDate: null }, true);
                this.endValue = null;
                this.setValue();
            }
        } else if (this.value && (<DateRange>this.value).start) {
            if ((<DateRange>this.value).start instanceof Date && !isNaN(+(<DateRange>this.value).start)) {
                this.setProperties({ startDate: (<DateRange>this.value).start }, true);
                this.startValue = (<DateRange>this.value).start;
            } else if (typeof (<DateRange>this.value).start === 'string') {
                this.setProperties({ startDate: new Date('' + (<DateRange>this.value).start) }, true);
                this.startValue = new Date('' + (<DateRange>this.value).start);
            } else {
                this.startValue = null;
                this.setValue();
            }
            if ((<DateRange>this.value).end instanceof Date && !isNaN(+(<DateRange>this.value).end)) {
                this.setProperties({ endDate: (<DateRange>this.value).end }, true);
                this.endValue = (<DateRange>this.value).end;
            } else if (typeof (<DateRange>this.value).end === 'string') {
                this.setProperties({ endDate: new Date('' + (<DateRange>this.value).end) }, true);
                this.endValue = new Date('' + (<DateRange>this.value).end);
                this.setValue();
            } else {
                this.setProperties({ endDate: null }, true);
                this.endValue = null;
                this.setValue();
            }
        } else if (isNullOrUndefined(this.value)) {
            this.endValue = this.checkDateValue(new Date('' + this.endDate));
            this.startValue = this.checkDateValue(new Date('' + this.startDate));
            this.setValue();
        }
    }
    private initProperty(): void {
        this.globalize = new Internationalization(this.locale);
        if (isNullOrUndefined(this.firstDayOfWeek) || this.firstDayOfWeek > 6 || this.firstDayOfWeek < 0) {
            this.setProperties({ firstDayOfWeek: this.globalize.getFirstDayOfWeek() }, true);
        }
        this.updateValue();
    }
    private initialize(): void {
        if (this.angularTag !== null) { this.validationAttribute(this.element, this.inputElement); }
        this.checkHtmlAttributes();
        merge(this.keyConfigs, { shiftTab: 'shift+tab' });
        this.setProperties({ startDate: this.checkDateValue(new Date('' + this.startValue)) }, true); // persist the value propeerty.
        this.setProperties({ endValue: this.checkDateValue(new Date('' + this.endValue)) }, true);
        this.setValue();
        this.setProperties({ min: this.checkDateValue(new Date('' + this.min)) }, true);
        this.setProperties({ max: this.checkDateValue(new Date('' + this.max)) }, true);
        this.l10n = new L10n('daterangepicker', this.defaultConstant, this.locale);
        this.l10n.setLocale(this.locale);
        this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        this.processPresets();
        this.createInput();
        this.setRangeAllowEdit();
        this.bindEvents();
    }

    private setRangeAllowEdit(): void {
        if (this.allowEdit) {
            if (!this.readonly) {
                this.inputElement.removeAttribute('readonly');
            }
        } else {
            attributes(this.inputElement, { 'readonly': '' });
        }
    }

    protected validationAttribute(element: HTMLElement, input: Element): void {
        let name: string = element.getAttribute('name') ? element.getAttribute('name') : element.getAttribute('id');
        input.setAttribute('name', name);
        element.removeAttribute('name');
        let attributes: string[] = ['required', 'aria-required', 'form'];
        for (let i: number = 0; i < attributes.length; i++) {
            if (isNullOrUndefined(element.getAttribute(attributes[i]))) {
                continue;
            }
            let attr: string = element.getAttribute(attributes[i]);
            input.setAttribute(attributes[i], attr);
            element.removeAttribute(attributes[i]);
        }
    }
    private processPresets(): void {
        this.presetsItem = [];
        let i: number = 0;
        if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
            for (let range of this.presets) {
                let id: string = range.label.replace(/\s+/g, '') + '_' + (++i);
                if (typeof range.end === 'string') {
                    this.presetsItem.push({
                        id: id, text: range.label, end: new Date('' + range.end), start: new Date('' + range.start)
                    });
                } else {
                    this.presetsItem.push({ id: id, text: range.label, start: range.start, end: range.end });
                }
            }
            let startDate: Date = isNullOrUndefined(this.startValue) ? null : new Date(+this.startValue);
            let endDate: Date = isNullOrUndefined(this.endValue) ? null : new Date(+this.endValue);
            this.presetsItem.push({ id: 'custom_range', text: this.l10n.getConstant('customRange'), start: startDate, end: endDate });
            if (!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) {
                this.isCustomRange = true;
                this.activeIndex = this.presetsItem.length - 1;
            }
        }
    }
    protected bindEvents(): void {
        if (this.enabled) {
            EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.rangeIconHandler, this);
            EventHandler.add(this.inputElement, 'focus', this.inputFocusHandler, this);
            EventHandler.add(this.inputElement, 'blur', this.inputBlurHandler, this);
            EventHandler.add(this.inputElement, 'change', this.inputChangeHandler, this);
            if (this.showClearButton) {
                EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.resetHandler, this);
            }
            if (!this.isMobile) {
                this.inputKeyboardModule = new KeyboardEvents(
                    this.inputElement, {
                        eventName: 'keydown', keyAction: this.inputHandler.bind(this), keyConfigs: this.keyInputConfigs
                    });
            }
            if (this.formElement) {
                EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
            }
        } else {
            EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown', this.rangeIconHandler);
            EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
            EventHandler.remove(this.inputElement, 'change', this.inputChangeHandler);
            if (this.showClearButton) {
                EventHandler.remove(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler);
            }
            if (!this.isMobile) {
                if (!isNullOrUndefined(this.inputKeyboardModule)) {
                    this.inputKeyboardModule.destroy();
                }
            }
            if (this.formElement) {
                EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
            }
        }
    }
    private updateHiddenInput(): void {
        if (this.firstHiddenChild && this.secondHiddenChild) {
            let format: Object = { type: 'datetime', skeleton: 'yMd' };
            if (typeof this.startDate === 'string') {
                this.startDate = this.globalize.parseDate(this.startDate, format);
            }
            if (typeof this.endDate === 'string') {
                this.endDate = this.globalize.parseDate(this.endDate, format);
            }
            this.firstHiddenChild.value = (this.startDate && this.globalize.formatDate(this.startDate, format))
                || (this.inputElement.value);
            this.secondHiddenChild.value = (this.endDate && this.globalize.formatDate(this.endDate, format)) ||
                (this.inputElement.value);
            this.dispatchEvent(this.firstHiddenChild, 'focusout');
            this.dispatchEvent(this.firstHiddenChild, 'change');
        }

    }

    private inputChangeHandler(e: MouseEvent): void {
        e.stopPropagation();
        this.updateHiddenInput();
    }
    private bindClearEvent(): void {
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.resetHandler, this);
        }
    }
    protected resetHandler(e: MouseEvent): void {
        this.valueType = this.value;
        e.preventDefault();
        this.clear();
        this.changeTrigger(e);
        this.clearRange();
        this.hide(e);
    }

    protected formResetHandler(e: MouseEvent): void {
        if (this.formElement && e.target === this.formElement) {
            this.value = null;
            if (this.inputElement) {
                Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
                attributes(this.inputElement, { 'aria-invalid': 'false' });
                removeClass([this.inputWrapper.container], ERROR);
            }
        }
    }
    private clear(): void {
        if (this.startValue !== null) {
            this.startValue = null;
        }
        if (this.endValue !== null) {
            this.endValue = null;
        }
        if (this.value && (<DateRange>this.value).start) {
            this.setProperties({ value: { start: null, end: null } }, true);
        }
        if (this.value !== null && (<Date[]>this.value).length > 0) {
            this.setProperties({ value: null }, true);
        }
        Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        if (!(isNullOrUndefined(this.applyButton))) {
            this.applyButton.disabled = this.applyButton.element.disabled = true;
        }
        this.removeSelection();
    }

    private rangeIconHandler(e: MouseEvent): void {
        if (this.isMobile) {
            this.element.setAttribute('readonly', 'readonly');
        }
        e.preventDefault();
        this.targetElement = null;
        if (this.isPopupOpen()) {
            this.applyFunction(e);
        } else {
            this.isRangeIconClicked = true;
            (<HTMLElement>this.inputWrapper.container.children[0]).focus();
            this.show(null, e);
            if (!this.isMobile) {
                if (!isNullOrUndefined(this.leftCalendar)) {
                    this.isRangeIconClicked = false;
                    this.calendarFocus();
                    this.isRangeIconClicked = true;
                }
            }
            addClass([this.inputWrapper.container], [INPUTFOCUS]);
        }
    }
    private checkHtmlAttributes(): void {
        this.globalize = new Internationalization(this.locale);
        let attributes: string[];
        attributes = ['startDate', 'endDate', 'minDays', 'maxDays', 'min', 'max', 'disabled',
            'readonly', 'style', 'name', 'placeholder', 'type'];
        let format: Object = { format: this.format, type: 'date', skeleton: 'yMd' };
        for (let prop of attributes) {
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        let disabled: boolean = this.inputElement.getAttribute(prop) === 'disabled' ||
                            this.inputElement.getAttribute(prop) === '';
                        this.setProperties({ enabled: !disabled }, true);
                        break;
                    case 'readonly':
                        let readonly: boolean = this.inputElement.getAttribute(prop) === 'readonly' ||
                            this.inputElement.getAttribute(prop) === '';
                        this.setProperties({ readonly: readonly }, true);
                        break;
                    case 'placeholder':
                        if (isNullOrUndefined(this.placeholder) || this.placeholder.trim() === '') {
                            this.setProperties({ placeholder: this.inputElement.getAttribute(prop) }, true);
                        }
                        break;
                    case 'style':
                        this.inputElement.setAttribute('style', '' + this.inputElement.getAttribute(prop));
                        break;
                    case 'min':
                        if (isNullOrUndefined(this.min) || +this.min === +new Date(1900, 0, 1)) {
                            let dateValue: Date = this.globalize.parseDate(this.inputElement.getAttribute(prop), format);
                            this.setProperties(setValue(prop, dateValue, {}), true);
                        }
                        break;
                    case 'name':
                        this.inputElement.setAttribute('name', '' + this.inputElement.getAttribute(prop));
                        break;
                    case 'max':
                        if (isNullOrUndefined(this.max) || +this.max === +new Date(2099, 11, 31)) {
                            let dateValue: Date = this.globalize.parseDate(this.inputElement.getAttribute(prop), format);
                            this.setProperties(setValue(prop, dateValue, {}), true);
                        }
                        break;
                    case 'startDate':
                        if (isNullOrUndefined(this.startDate)) {
                            let dateValue: Date = this.globalize.parseDate(this.inputElement.getAttribute(prop), format);
                            this.startValue = dateValue;
                            this.setValue();
                        }
                        break;
                    case 'endDate':
                        if (isNullOrUndefined(this.endDate)) {
                            let dateValue: Date = this.globalize.parseDate(this.inputElement.getAttribute(prop), format);
                            this.endValue = dateValue;
                            this.setValue();
                        }
                        break;
                    case 'minDays':
                        if (isNullOrUndefined(this.minDays)) {
                            this.setProperties(setValue(prop, parseInt(this.inputElement.getAttribute(prop), 10), {}), true);
                        }
                        break;
                    case 'maxDays':
                        if (isNullOrUndefined(this.maxDays)) {
                            this.setProperties(setValue(prop, parseInt(this.inputElement.getAttribute(prop), 10), {}), true);
                        }
                        break;
                    case 'type':
                        if (this.inputElement.getAttribute(prop) !== 'text') {
                            this.inputElement.setAttribute('type', 'text');
                        }
                        break;
                }
            }
        }
    }

    private createPopup(): void {
        for (let i: number = 0; i < this.presetsItem.length; i++) {
            if ((i !== (this.presetsItem.length - 1)) && this.presetsItem[i].id === 'custom_range') {
                this.presetsItem.splice(i, 1);
            }
        }
        this.activeIndex = this.presetsItem.length - 1;
        this.isCustomRange = true;
        for (let i: number = 0; i <= this.presetsItem.length - 2; i++) {
            let startDate: Date = this.presetsItem[i].start as Date;
            let endDate: Date = this.presetsItem[i].end as Date;
            if (this.startValue && this.endValue) {
                if ((+startDate.setMilliseconds(0) === +this.startValue.setMilliseconds(0)) &&
                    (+endDate.setMilliseconds(0) === +this.endValue.setMilliseconds(0))) {
                    this.activeIndex = i;
                    this.isCustomRange = false;
                }
            }
        }
        this.popupWrapper = createElement('div', { id: this.element.id + '_popup', className: ROOT + ' ' + POPUP });
        let isPreset: boolean = (!this.isCustomRange || this.isMobile);
        if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && isPreset) {
            this.isCustomWindow = false;
            this.createPresets();
            this.listRippleEffect();
            this.renderPopup();
        } else {
            this.isCustomWindow = true;
            this.renderControl();
        }
    }
    private renderControl(): void {
        this.createControl();
        this.bindCalendarEvents();
        this.updateRange((this.isMobile ? [this.calendarElement] : [this.leftCalendar, this.rightCalendar]));
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            this.disabledDateRender();
        }
        this.updateHeader();
    }
    private clearCalendarEvents(): void {
        EventHandler.clearEvents(this.leftCalPrevIcon);
        EventHandler.clearEvents(this.leftCalNextIcon);
        EventHandler.clearEvents(this.rightCalPrevIcon);
        EventHandler.clearEvents(this.rightCalNextIcon);
    }
    private updateNavIcons(): void {
        if (this.currentView() === 'Year' || this.currentView() === 'Decade') {
            return;
        }
        this.previousIcon = this.rightCalPrevIcon;
        this.nextIcon = this.leftCalNextIcon;
        this.nextIconHandler(this.compareMonths(new Date('' + this.leftCalCurrentDate), this.rightCalCurrentDate) < 1);
        this.previousIconHandler(this.compareMonths(new Date('' + this.leftCalCurrentDate), this.rightCalCurrentDate) < 1);
    }
    private calendarIconEvent(): void {
        this.clearCalendarEvents();
        if (this.leftCalPrevIcon && !this.leftCalPrevIcon.classList.contains(DISABLED)) {
            EventHandler.add(this.leftCalPrevIcon, 'mousedown', this.navPrevFunction);
        }
        if (this.leftCalNextIcon && !this.leftCalNextIcon.classList.contains(DISABLED)) {
            EventHandler.add(this.leftCalNextIcon, 'mousedown', this.navNextFunction);
        }
        if (this.rightCalPrevIcon && !this.rightCalPrevIcon.classList.contains(DISABLED)) {
            EventHandler.add(this.rightCalPrevIcon, 'mousedown', this.navPrevFunction);
        }
        if (this.rightCalNextIcon && !this.rightCalNextIcon.classList.contains(DISABLED)) {
            EventHandler.add(this.rightCalNextIcon, 'mousedown', this.navNextFunction);
        }
    }
    private bindCalendarEvents(): void {
        if (!this.isMobile) {
            this.updateNavIcons();
            this.calendarIconEvent();
            this.calendarIconRipple();
            this.headerTitleElement = <HTMLElement>this.popupObj.element.querySelector('.' + RIGHTCALENDER + ' .' + HEADER + ' .' + TITLE);
            this.headerTitleElement = <HTMLElement>this.popupObj.element.querySelector('.' + LEFTCALENDER + ' .' + HEADER + ' .' + TITLE);
            this.leftKeyboardModule = new KeyboardEvents(
                <HTMLElement>this.leftCalendar,
                {
                    eventName: 'keydown',
                    keyAction: this.keyInputHandler.bind(this),
                    keyConfigs: this.keyConfigs
                });
            this.rightKeyboardModule = new KeyboardEvents(
                <HTMLElement>this.rightCalendar,
                {
                    eventName: 'keydown',
                    keyAction: this.keyInputHandler.bind(this),
                    keyConfigs: this.keyConfigs
                });
        } else {
            this.deviceCalendarEvent();
            EventHandler.add(this.startButton.element, 'click', this.deviceHeaderClick, this);
            EventHandler.add(this.endButton.element, 'click', this.deviceHeaderClick, this);
        }
        this.bindCalendarCellEvents();
        this.removeFocusedDate();
    }
    private calendarIconRipple(): void {
        rippleEffect(this.leftCalPrevIcon, { selector: '.e-prev', duration: 400, isCenterRipple: true });
        rippleEffect(this.leftCalNextIcon, { selector: '.e-next', duration: 400, isCenterRipple: true });
        rippleEffect(this.rightCalPrevIcon, { selector: '.e-prev', duration: 400, isCenterRipple: true });
        rippleEffect(this.rightCalNextIcon, { selector: '.e-next', duration: 400, isCenterRipple: true });
    }
    private deviceCalendarEvent(): void {
        EventHandler.clearEvents(this.nextIcon);
        EventHandler.clearEvents(this.previousIcon);
        rippleEffect(this.nextIcon, { selector: '.e-prev', duration: 400, isCenterRipple: true });
        rippleEffect(this.previousIcon, { selector: '.e-next', duration: 400, isCenterRipple: true });
        if (this.nextIcon && !this.nextIcon.classList.contains(DISABLED)) {
            EventHandler.add(this.nextIcon, 'mousedown', this.deviceNavNextFunction);
        }
        if (this.previousIcon && !this.previousIcon.classList.contains(DISABLED)) {
            EventHandler.add(this.previousIcon, 'mousedown', this.deviceNavPrevFunction);
        }
    }
    private deviceNavNext(e: MouseEvent): void {
        let calendar: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + CALENDAR);
        this.updateDeviceCalendar(calendar);
        this.navigateNext(e);
        this.deviceNavigation();
    }
    private deviceNavPrevious(e: MouseEvent): void {
        let calendar: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + CALENDAR);
        this.updateDeviceCalendar(calendar);
        this.navigatePrevious(e);
        this.deviceNavigation();
    }
    private updateDeviceCalendar(calendar: HTMLElement): void {
        if (calendar) {
            this.previousIcon = <HTMLElement>calendar.querySelector('.' + PREVICON);
            this.nextIcon = <HTMLElement>calendar.querySelector('.' + NEXTICON);
            this.calendarElement = calendar;
            this.deviceCalendar = calendar;
            this.contentElement = <HTMLElement>calendar.querySelector('.' + CONTENT);
            this.tableBodyElement = select('.' + CONTENT + ' tbody', calendar);
            this.table = <HTMLElement>calendar.querySelector('.' + CONTENT).getElementsByTagName('table')[0];
            this.headerTitleElement = <HTMLElement>calendar.querySelector('.' + HEADER + ' .' + TITLE);
            this.headerElement = <HTMLElement>calendar.querySelector('.' + HEADER);
        }
    }
    private deviceHeaderClick(event: MouseEvent): void {
        let element: Element = <Element>event.currentTarget;
        if (element.classList.contains(STARTBUTTON) && !isNullOrUndefined(this.startValue)) {
            this.endButton.element.classList.remove(ACTIVE);
            this.startButton.element.classList.add(ACTIVE);
            let calendar: HTMLElement = <HTMLElement>this.popupObj.element.querySelector('.' + CALENDAR);
            this.updateDeviceCalendar(calendar);
            if (isNullOrUndefined(this.calendarElement.querySelector('.' + STARTDATE + ':not(.e-other-month)'))) {
                this.currentDate = new Date(+this.startValue);
                remove(this.tableBodyElement);
                this.renderMonths();
                this.deviceNavigation();
            }
            this.removeClassDisabled();
        } else if (!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) {
            this.startButton.element.classList.remove(ACTIVE);
            this.endButton.element.classList.add(ACTIVE);
            let calendar: HTMLElement = <HTMLElement>this.popupObj.element.querySelector('.' + CALENDAR);
            this.updateDeviceCalendar(calendar);
            if (isNullOrUndefined(this.calendarElement.querySelector('.' + ENDDATE + ':not(.e-other-month)'))) {
                this.currentDate = new Date(+this.endValue);
                remove(this.tableBodyElement);
                this.renderMonths();
                this.deviceNavigation();
            }
            this.updateMinMaxDays(<HTMLElement>this.popupObj.element.querySelector('.' + CALENDAR));
            this.selectableDates();
        }
    }
    private inputFocusHandler(): void {
        this.preventBlur = false;
        let focusArguments: FocusEventArgs = {
            model: this
        };
        if (!this.preventFocus) {
            this.preventFocus = true;
            this.trigger('focus', focusArguments);
        }
        this.updateHiddenInput();
    }

    private inputBlurHandler(e: MouseEvent | KeyboardEvent): void {
        if (!this.preventBlur) {
            let value: string = (<HTMLInputElement>this.inputElement).value;
            if (!isNullOrUndefined(this.presetsItem)) {
                if (this.presetsItem.length > 0 && this.previousEleValue !== this.inputElement.value) {
                    this.activeIndex = this.presetsItem.length - 1;
                    this.isCustomRange = true;
                }
            }
            if (!isNullOrUndefined(value) && value.trim() !== '') {
                let range: string[] = value.split(' ' + this.separator + ' ');
                if (range.length > 1) {
                    let dateOptions: object = { format: this.format, type: 'date', skeleton: 'yMd' };
                    let startDate: Date = this.globalize.parseDate(range[0].trim(), dateOptions);
                    let endDate: Date = this.globalize.parseDate(range[1].trim(), dateOptions);
                    if (!isNullOrUndefined(startDate) && !isNaN(+startDate) && !isNullOrUndefined(endDate) && !isNaN(+endDate)) {
                        this.startValue = startDate;
                        this.endValue = endDate;
                        this.setValue();
                        this.refreshControl();
                        this.changeTrigger(e);
                        if (!this.preventBlur && document.activeElement !== this.inputElement) {
                            this.preventFocus = false;
                            let blurArguments: BlurEventArgs = {
                                model: this
                            };
                            this.trigger('blur', blurArguments);
                        }
                        this.updateHiddenInput();
                        return;
                    } else {
                        if (!this.strictMode) {
                            this.startValue = null;
                            this.endValue = null;
                            this.setValue();
                        }
                    }
                } else {
                    if (!this.strictMode) {
                        this.startValue = null;
                        this.endValue = null;
                        this.setValue();
                    }
                }
            }
            if (!this.strictMode) {
                this.clearRange();
                this.startValue = null;
                this.endValue = null;
                this.setValue();
            } else {
                Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
                this.updateInput();
            }
            this.errorClass();
            this.changeTrigger(e);
            if (!this.preventBlur && document.activeElement !== this.inputElement) {
                this.preventFocus = false;
                let blurArguments: BlurEventArgs = {
                    model: this
                };
                this.trigger('blur', blurArguments);
            }
        }
        this.updateHiddenInput();
    }
    private clearRange(): void {
        this.previousStartValue = this.previousEndValue = null;
        this.currentDate = null;
    }
    private errorClass(): void {
        let inputStr: String = this.inputElement.value.trim();
        if (((isNullOrUndefined(this.endValue) && isNullOrUndefined(this.startValue) && inputStr !== '') ||
            ((!isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
                || ((!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)
                || (!isNullOrUndefined(this.endValue) && +this.endValue > +this.max))
            || ((this.startValue && this.isDateDisabled(this.startValue))
                || (this.endValue && this.isDateDisabled(this.endValue)))) && inputStr !== '') {
            addClass([this.inputWrapper.container], ERROR);
            attributes(this.inputElement, { 'aria-invalid': 'true' });
        } else {
            if (this.inputWrapper) {
                removeClass([this.inputWrapper.container], ERROR);
                attributes(this.inputElement, { 'aria-invalid': 'false' });
            }
        }
    }
    private keyCalendarUpdate(isLeftCalendar: boolean, ele: HTMLElement): HTMLElement {
        this.removeFocusedDate();
        if (isLeftCalendar) {
            this.leftCalCurrentDate = new Date(+this.currentDate);
            ele = this.leftCalendar;
        } else {
            this.rightCalCurrentDate = new Date(+this.currentDate);
            ele = this.rightCalendar;
        }
        this.updateCalendarElement(ele);
        this.table.focus();
        return ele;
    }
    private navInCalendar(e: KeyboardEventArgs, isLeftCalendar: boolean, leftLimit: Date, rightLimit: Date, ele: HTMLElement): void {
        let view: number = this.getViewNumber(this.currentView());
        let date: Date;
        let min: Date = this.min;
        let max: Date;
        if (!isNullOrUndefined(this.maxDays) && this.isMaxDaysClicked && !isNullOrUndefined(this.startValue)) {
            max = new Date(new Date(+this.startValue).setDate(this.startValue.getDate() + (this.maxDays - 1)));
        } else {
            max = this.max;
        }
        switch (e.action) {
            case 'moveRight':
                date = new Date(+this.currentDate);
                this.addDay(date, 1, e, max, min);
                if (isLeftCalendar && +date === +rightLimit) {
                    ele = this.keyCalendarUpdate(false, ele);
                }
                this.KeyboardNavigate(1, view, e, max, min);
                this.keyNavigation(ele, e);
                break;
            case 'moveLeft':
                date = new Date(+this.currentDate);
                this.addDay(date, -1, e, max, min);
                if (!isLeftCalendar) {
                    if (+date === +leftLimit) {
                        ele = this.keyCalendarUpdate(true, ele);
                    }
                }
                this.KeyboardNavigate(-1, view, e, max, min);
                this.keyNavigation(ele, e);
                break;
            case 'moveUp':
                if (view === 0) {
                    date = new Date(+this.currentDate);
                    this.addDay(date, -7, e, max, min);
                    if (+date <= +leftLimit && !isLeftCalendar) {
                        ele = this.keyCalendarUpdate(true, ele);
                    }
                    this.KeyboardNavigate(-7, view, e, max, min);
                } else {
                    this.KeyboardNavigate(-4, view, e, this.max, this.min); // move the current year to the previous four days.
                }
                this.keyNavigation(ele, e);
                break;
            case 'moveDown':
                if (view === 0) {
                    date = new Date(+this.currentDate);
                    this.addDay(date, 7, e, max, min);
                    if (isLeftCalendar && +date >= +rightLimit) {
                        ele = this.keyCalendarUpdate(false, ele);
                    }
                    this.KeyboardNavigate(7, view, e, max, min);
                } else {
                    this.KeyboardNavigate(4, view, e, this.max, this.min);
                }
                this.keyNavigation(ele, e);
                break;
            case 'home':
                this.currentDate = this.firstDay(this.currentDate);
                remove(this.tableBodyElement);
                (view === 0) ? this.renderMonths(e) : ((view === 1) ? this.renderYears(e) : this.renderDecades(e));
                this.keyNavigation(ele, e);
                break;
            case 'end':
                this.currentDate = this.lastDay(this.currentDate, view);
                remove(this.tableBodyElement);
                (view === 0) ? this.renderMonths(e) : ((view === 1) ? this.renderYears(e) : this.renderDecades(e));
                this.keyNavigation(ele, e);
                break;
        }
    }
    // tslint:disable-next-line:max-func-body-length
    private keyInputHandler(e: KeyboardEventArgs, value?: Date): void {
        let date: Date;
        let view: number = this.getViewNumber(this.currentView());
        let rightDateLimit: Date = new Date(this.rightCalCurrentDate.getFullYear(), this.rightCalCurrentDate.getMonth(), 1);
        let leftDateLimit: Date = new Date(this.leftCalCurrentDate.getFullYear(), this.leftCalCurrentDate.getMonth() + 1, 0);
        let ele: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + RIGHTCALENDER);
        ele = isNullOrUndefined(ele) ? this.leftCalendar : ele;
        let isLeftCalendar: boolean = ele.classList.contains(LEFTCALENDER);
        this.updateCalendarElement(ele);
        let selectedDate: Element = this.tableBodyElement.querySelector('tr td.e-selected');
        let focusedDate: Element = ele.querySelector('tr td.' + FOCUSDATE);
        let startDate: Element = ele.querySelector('tr td.' + STARTDATE);
        let endDate: Element = ele.querySelector('tr td.' + ENDDATE);
        let depthValue: number = this.getViewNumber(this.depth);
        let levelRestrict: boolean = (view === depthValue && this.getViewNumber(this.start) >= depthValue);
        let leftCalendar: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + LEFTCALENDER);
        let rightCalendar: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + RIGHTCALENDER);
        let presetElement: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + PRESETS);
        if (!isNullOrUndefined(focusedDate)) {
            this.currentDate = this.currentDate;
        } else if (!isNullOrUndefined(endDate) && !this.dateDisabled) {
            this.currentDate = new Date(+this.endValue);
        } else if (!isNullOrUndefined(startDate) && !this.dateDisabled) {
            this.currentDate = new Date(+this.startValue);
        } else if (!this.dateDisabled) {
            this.currentDate.setDate(1);
        }
        this.effect = '';
        switch (e.action) {
            case 'altUpArrow':
                if (this.isPopupOpen()) {
                    this.hide(e);
                    this.preventFocus = true;
                    this.inputElement.focus();
                    addClass([this.inputWrapper.container], [INPUTFOCUS]);
                }
                break;
            case 'select':
                if (view === 0) {
                    let element: Element = !isNullOrUndefined(focusedDate) ? focusedDate : startDate;
                    if (!isNullOrUndefined(element) && !element.classList.contains(DISABLED)) {
                        this.selectRange(null, (element));
                    }
                } else {
                    if (!isNullOrUndefined(selectedDate) && !levelRestrict || !isNullOrUndefined(focusedDate)) {
                        if (!isNullOrUndefined(this.value)) {
                            if (this.calendarElement.classList.contains(LEFTCALENDER)) {
                                value = this.startDate;
                            } else {
                                value = this.endDate;
                            }
                        }
                        this.controlDown = e;
                        this.contentClick(null, --view, (focusedDate || selectedDate), value);
                    }
                }
                e.preventDefault();
                break;
            case 'controlHome':
                let yearDate: Date = new Date(this.currentDate.getFullYear(), 0, 1);
                if (!isLeftCalendar && +yearDate < +leftDateLimit) {
                    ele = this.keyCalendarUpdate(true, ele);
                }
                this.navigateTo('Month', new Date(this.currentDate.getFullYear(), 0, 1));
                this.keyNavigation(ele, e);
                break;
            case 'altRightArrow':
                if (!isNullOrUndefined(leftCalendar)) {
                    (<HTMLElement>this.rightCalendar.children[1].firstElementChild).focus();
                } else if (!isNullOrUndefined(rightCalendar)) {
                    if (!isNullOrUndefined(this.presetElement)) {
                        this.presetElement.focus();
                        this.removeFocusedDate();
                    } else {
                        this.cancelButton.element.focus();
                    }
                } else {
                    if (!isNullOrUndefined(presetElement)) {
                        this.cancelButton.element.focus();
                    }
                }
                e.preventDefault();
                break;
            case 'altLeftArrow':
                if (!isNullOrUndefined(leftCalendar)) {
                    if (this.applyButton.element.disabled !== true) {
                        this.applyButton.element.focus();
                    } else {
                        this.cancelButton.element.focus();
                    }
                } else {
                    if (!isNullOrUndefined(rightCalendar)) {
                        (<HTMLElement>this.leftCalendar.children[1].firstElementChild).focus();
                    }
                }
                e.preventDefault();
                break;
            case 'controlUp':
                if (this.calendarElement.classList.contains(LEFTCALENDER)) {
                    this.calendarNavigation(e, this.calendarElement);
                } else {
                    this.calendarNavigation(e, this.calendarElement);
                }
                e.preventDefault();
                break;
            case 'controlDown':
                if ((!isNullOrUndefined(selectedDate) && !levelRestrict) || !isNullOrUndefined(focusedDate)) {
                    if (!isNullOrUndefined(this.value)) {
                        if (this.calendarElement.classList.contains(LEFTCALENDER)) {
                            value = this.startDate;
                        } else {
                            value = this.endDate;
                        }
                    }
                    this.controlDown = e;
                    this.contentClick(null, --view, (selectedDate || focusedDate), value);
                }
                e.preventDefault();
                break;
            case 'controlEnd':
                yearDate = new Date(this.currentDate.getFullYear(), 11, 31);
                if (isLeftCalendar && +yearDate > +rightDateLimit) {
                    ele = this.keyCalendarUpdate(false, ele);
                }
                this.navigateTo('Month', new Date(this.currentDate.getFullYear(), 11, 31));
                this.keyNavigation(ele, e);
                break;
            case 'pageUp':
                date = new Date(+this.currentDate);
                this.addMonths(date, -1);
                if (!isLeftCalendar && +date <= +leftDateLimit) {
                    ele = this.keyCalendarUpdate(true, ele);
                }
                this.addMonths(this.currentDate, -1);
                this.navigateTo('Month', this.currentDate);
                this.keyNavigation(ele, e);
                break;
            case 'pageDown':
                date = new Date(+this.currentDate);
                this.addMonths(date, 1);
                if (isLeftCalendar && +date >= +rightDateLimit) {
                    ele = this.keyCalendarUpdate(false, ele);
                }
                this.addMonths(this.currentDate, 1);
                this.navigateTo('Month', this.currentDate);
                this.keyNavigation(ele, e);
                break;
            case 'shiftPageUp':
                date = new Date(+this.currentDate);
                this.addYears(date, -1);
                if (!isLeftCalendar && +date <= +leftDateLimit) {
                    ele = this.keyCalendarUpdate(true, ele);
                }
                this.addYears(this.currentDate, -1);
                this.navigateTo('Month', this.currentDate);
                this.keyNavigation(ele, e);
                break;
            case 'shiftPageDown':
                date = new Date(+this.currentDate);
                this.addYears(date, 1);
                if (isLeftCalendar && +date >= +rightDateLimit) {
                    ele = this.keyCalendarUpdate(false, ele);
                }
                this.addYears(this.currentDate, 1);
                this.navigateTo('Month', this.currentDate);
                this.keyNavigation(ele, e);
                break;
            case 'shiftTab':
                if (!isNullOrUndefined(this.presetElement)) {
                    this.presetElement.setAttribute('tabindex', '0');
                    this.presetElement.focus();
                    this.removeFocusedDate();
                }
                e.preventDefault();
                break;
            case 'spacebar':
                if (this.applyButton && !this.applyButton.disabled) {
                    this.applyFunction(e);
                }
                break;
            default:
                this.navInCalendar(e, isLeftCalendar, leftDateLimit, rightDateLimit, ele);
                this.checkMinMaxDays();
        }
        this.presetHeight();
    }
    private keyNavigation(calendar: HTMLElement, e: KeyboardEventArgs): void {
        this.bindCalendarCellEvents(calendar);
        if (calendar.classList.contains(LEFTCALENDER)) {
            this.leftCalCurrentDate = new Date(+this.currentDate);
        } else {
            this.rightCalCurrentDate = new Date(+this.currentDate);
        }
        this.updateNavIcons();
        this.calendarIconEvent();
        this.updateRange([calendar]);
        this.dateDisabled = this.isDateDisabled(this.currentDate);
        e.preventDefault();
    }
    private inputHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
            case 'altDownArrow':
                if (!this.isPopupOpen()) {
                    if (this.inputElement.value === '') {
                        this.clear();
                        this.changeTrigger(e);
                        this.clearRange();
                    }
                    this.show(null, e);
                    this.isRangeIconClicked = false;
                    if (!this.isMobile) {
                        if (!isNullOrUndefined(this.leftCalendar)) {
                            this.calendarFocus();
                        }
                    }
                    this.isKeyPopup = true;
                }
                break;
            case 'escape':
                if (this.isPopupOpen()) {
                    this.hide(e);
                }
                break;
            case 'enter':
                if (document.activeElement === this.inputElement) {
                    this.inputBlurHandler(e);
                    this.hide(e);
                }
                break;
            case 'tab':
                if (document.activeElement === this.inputElement && this.isPopupOpen()) {
                    this.hide(e);
                    e.preventDefault();
                }
                break;
        }
    }
    private bindCalendarCellEvents(calendar?: HTMLElement): void {
        let tdCells: HTMLElement[];
        if (calendar) {
            tdCells = <HTMLElement[] & NodeListOf<Element>>calendar.querySelectorAll('.' + CALENDAR + ' td');
        } else {
            tdCells = <HTMLElement[] & NodeListOf<Element>>this.popupObj.element.querySelectorAll('.' + CALENDAR + ' td');
        }
        for (let cell of tdCells) {
            EventHandler.clearEvents(cell);
            let disabledCell: boolean;
            disabledCell = cell.classList.contains(DISABLED) || cell.classList.contains(DATEDISABLED);
            if (!disabledCell && !cell.classList.contains(WEEKNUMBER)) {
                if (!this.isMobile) {
                    EventHandler.add(cell, 'mouseover', this.hoverSelection, this);
                }
                EventHandler.add(cell, 'mousedown', this.selectRange, this);
            }
        }
    }
    private removeFocusedDate(): void {
        let isDate: boolean = !isNullOrUndefined(this.startValue) || !isNullOrUndefined(this.endValue);
        let focusedDate: HTMLElement[];
        focusedDate = <HTMLElement[] & NodeListOf<Element>>this.popupObj.element.querySelectorAll('.' + CALENDAR + ' .' + FOCUSDATE);
        if ((this.leftCalendar && this.leftCalendar.querySelector('.e-content').classList.contains('e-month')
            && this.rightCalendar && this.rightCalendar.querySelector('.e-content').classList.contains('e-month')) ||
            this.calendarElement && this.calendarElement.querySelector('.e-content').classList.contains('e-month')) {
            for (let ele of focusedDate) {
                if (!ele.classList.contains(TODAY) || (ele.classList.contains(TODAY) && (isDate))) {
                    ele.classList.remove(FOCUSDATE);
                    if (!ele.classList.contains(STARTDATE) && !ele.classList.contains(ENDDATE)) {
                        ele.removeAttribute('aria-label');
                    }
                }
            }
        }
    }
    private hoverSelection(event: MouseEvent | KeyboardEventArgs | TouchEvent, element: Element): void {
        let currentElement: HTMLElement = <HTMLElement>element || <HTMLElement>event.currentTarget;
        let currentDate: Date = this.getIdValue(null, currentElement);
        if (!isNullOrUndefined(this.startValue) && +this.startValue >= +this.min && +this.startValue <= +this.max) {
            if ((!this.isDateDisabled(this.endValue) && !this.isDateDisabled(this.startValue)
                && isNullOrUndefined(this.endValue) && isNullOrUndefined(this.startValue))
                || (!isNullOrUndefined(this.startValue) && isNullOrUndefined(this.endValue))) {
                let tdCells: HTMLElement[];
                tdCells = <HTMLElement[] & NodeListOf<Element>>this.popupObj.element.querySelectorAll('.' + CALENDAR + ' td');
                for (let ele of tdCells) {
                    let isDisabledCell: boolean = (!ele.classList.contains(DISABLED) || ele.classList.contains(DATEDISABLED));
                    if (!ele.classList.contains(WEEKNUMBER) && isDisabledCell) {
                        let eleDate: Date = this.getIdValue(null, ele);
                        let startDateValue: Date = new Date(+this.startValue);
                        let eleDateValue: Date = new Date(+eleDate);
                        if (eleDateValue.setHours(0, 0, 0, 0) >= startDateValue.setHours(0, 0, 0, 0) && +eleDate <= +currentDate) {
                            addClass([ele], RANGEHOVER);
                        } else {
                            removeClass([ele], [RANGEHOVER]);
                        }
                    }
                }
            }
        }
    }
    private updateRange(elementCollection: HTMLElement[]): void {
        if (!isNullOrUndefined(this.startValue)) {
            for (let calendar of elementCollection) {
                let tdCells: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>calendar.querySelectorAll('.' + CALENDAR + ' td');
                for (let ele of tdCells) {
                    if (!ele.classList.contains(WEEKNUMBER) && !ele.classList.contains(DISABLED)) {
                        let eleDate: Date = this.getIdValue(null, ele);
                        let eleDateValue: Date = this.getIdValue(null, ele);
                        if (!isNullOrUndefined(this.endValue)) {
                            if (this.currentView() === 'Month' &&
                                +eleDateValue.setHours(0, 0, 0, 0) >= +new Date(+this.startValue).setHours(0, 0, 0, 0)
                                && +eleDateValue.setHours(0, 0, 0, 0) <= +new Date(+this.endValue).setHours(0, 0, 0, 0) &&
                                +new Date(+this.startValue).setHours(0, 0, 0, 0) !== +new Date(+this.endValue).setHours(0, 0, 0, 0) &&
                                +new Date(+this.startValue).setHours(0, 0, 0, 0) >= +this.min
                                && +new Date(+this.endValue).setHours(0, 0, 0, 0) <= +this.max
                                && !(this.isDateDisabled(this.startValue) || this.isDateDisabled(this.endValue))) {
                                addClass([ele], RANGEHOVER);
                            }
                        } else {
                            removeClass([ele], [RANGEHOVER]);
                        }
                        if (!ele.classList.contains(OTHERMONTH)) {
                            let startDateValue: Date = new Date(+this.startValue);
                            let eleDateValue: Date = new Date(+eleDate);
                            if (this.currentView() === 'Month' &&
                                +eleDateValue.setHours(0, 0, 0, 0) === +startDateValue.setHours(0, 0, 0, 0)
                                && +eleDateValue.setHours(0, 0, 0, 0) >= +startDateValue.setHours(0, 0, 0, 0) &&
                                +this.startValue >= +this.min
                                && !this.inputWrapper.container.classList.contains('e-error')
                                && !(this.isDateDisabled(this.startValue) || this.isDateDisabled(this.endValue))) {
                                addClass([ele], [STARTDATE, SELECTED]);
                                this.addSelectedAttributes(ele, this.startValue, true);
                            }
                            let endDateValue: Date = new Date(+this.endValue);
                            if (this.currentView() === 'Month' &&
                                !isNullOrUndefined(this.endValue) &&
                                +eleDateValue.setHours(0, 0, 0, 0) === +endDateValue.setHours(0, 0, 0, 0)
                                && +eleDateValue.setHours(0, 0, 0, 0) <= +endDateValue.setHours(0, 0, 0, 0) &&
                                +this.startValue >= +this.min
                                && !this.inputWrapper.container.classList.contains('e-error')
                                && !(this.isDateDisabled(this.startValue) || this.isDateDisabled(this.endValue))) {
                                addClass([ele], [ENDDATE, SELECTED]);
                                this.addSelectedAttributes(ele, this.startValue, false);
                            }
                            if (+eleDate === +this.startValue && !isNullOrUndefined(this.endValue) && +eleDate === +this.endValue) {
                                this.addSelectedAttributes(ele, this.endValue, false, true);
                            }
                        }
                    }
                }
            }
        }
    }
    private checkMinMaxDays(): void {
        if ((!isNullOrUndefined(this.minDays) && this.minDays > 0) || (!isNullOrUndefined(this.maxDays) && this.maxDays > 0)) {
            if (!this.isMobile) {
                this.updateMinMaxDays(<HTMLElement>this.popupObj.element.querySelector('.' + LEFTCALENDER));
                this.updateMinMaxDays(<HTMLElement>this.popupObj.element.querySelector('.' + RIGHTCALENDER));
            } else {
                this.updateMinMaxDays(<HTMLElement>this.popupObj.element.querySelector('.' + CALENDAR));
            }
        }
    }
    private rangeArgs(e: MouseEvent | KeyboardEvent | TouchEvent): RangeEventArgs {
        let inputValue: string;
        let range: number;
        let startDate: string = !isNullOrUndefined(this.startValue) ?
            this.globalize.formatDate(this.startValue, { format: this.format, type: 'date', skeleton: 'yMd' }) : null;
        let endDate: string = !isNullOrUndefined(this.endValue) ?
            this.globalize.formatDate(this.endValue, { format: this.format, type: 'date', skeleton: 'yMd' }) : null;
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            inputValue = startDate + ' ' + this.separator + ' ' + endDate;
            range = (Math.round(Math.abs((this.startValue.getTime() - this.endValue.getTime()) / (1000 * 60 * 60 * 24))) + 1);
        } else {
            inputValue = '';
            range = 0;
        }
        let args: RangeEventArgs = {
            value: this.value,
            startDate: this.startValue,
            endDate: this.endValue,
            daySpan: range,
            event: e || null,
            element: this.element,
            isInteracted: !isNullOrUndefined(e),
            text: inputValue

        };
        return args;
    }
    private otherMonthSelect(ele: Element, isStartDate: boolean, sameDate?: boolean): void {
        let value: number = +this.getIdValue(null, ele);
        let dateIdString: string = '*[id^="/id"]:not(.e-other-month)'.replace('/id', '' + value);
        let tdCell: Element = this.popupObj && this.popupObj.element.querySelector(dateIdString);
        if (!isNullOrUndefined(tdCell)) {
            if (isStartDate) {
                addClass([tdCell], [STARTDATE, SELECTED]);
                this.addSelectedAttributes(tdCell, this.startValue, true);
            } else {
                addClass([tdCell], [ENDDATE, SELECTED]);
                this.addSelectedAttributes(tdCell, this.endValue, true);
            }
            if (sameDate) {
                this.addSelectedAttributes(ele, this.endValue, false, true);
            }

        }
    }
    // tslint:disable-next-line:max-func-body-length
    private selectRange(event: MouseEvent | KeyboardEventArgs | TouchEvent, element: Element): void {
        let leftCalendar: HTMLElement;
        let rightCalendar: HTMLElement;
        if (event) {
            event.preventDefault();
        }
        let date: Date;
        date = isNullOrUndefined(event) ? this.getIdValue(null, element)
            : this.getIdValue(event, null);
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            if (!this.isMobile || this.isMobile && !this.endButton.element.classList.contains(ACTIVE)) {
                this.removeSelection();
            }
        } else if (this.isMobile && this.startButton.element.classList.contains(ACTIVE)) {
            this.removeSelection();
        }
        let ele: Element = element || <Element>event.currentTarget;
        if (isNullOrUndefined(this.startValue)) {
            if (!isNullOrUndefined(this.previousStartValue)) {
                date.setHours(this.previousStartValue.getHours());
                date.setMinutes(this.previousStartValue.getMinutes());
                date.setSeconds(this.previousStartValue.getSeconds());
            }
            this.startValue = new Date('' + date);
            this.endValue = null;
            this.setValue();
            addClass([ele], STARTDATE);
            this.addSelectedAttributes(ele, this.startValue, true);
            if (ele.classList.contains(OTHERMONTH)) {
                this.otherMonthSelect(ele, true);
            }
            this.checkMinMaxDays();
            this.applyButton.disabled = true;
            this.applyButton.element.disabled = true;
            if (this.isMobile) {
                this.endButton.element.classList.add(ACTIVE);
                this.startButton.element.classList.remove(ACTIVE);
                this.endButton.element.removeAttribute('disabled');
                this.selectableDates();
            }
            this.trigger('select', this.rangeArgs(event));
        } else {
            if (+ date === +this.startValue || +date > +this.startValue) {
                if (+date === +this.startValue && !isNullOrUndefined(this.minDays) && this.minDays > 1) {
                    return;
                }
                this.endValue = null;
                this.setValue();
                if (this.isMobile || element) {
                    this.hoverSelection(event, element);
                }
                if (!isNullOrUndefined(this.previousEndValue)) {
                    date.setHours(this.previousEndValue.getHours());
                    date.setMinutes(this.previousEndValue.getMinutes());
                    date.setSeconds(this.previousEndValue.getSeconds());
                }
                this.endValue = new Date('' + date);
                this.setValue();
                let endEle: Element[] = <Element[] & NodeListOf<Element>>this.popupObj.element.querySelectorAll('.' + ENDDATE);
                if (this.isMobile) {
                    this.startButton.element.classList.remove(ACTIVE);
                    this.endButton.element.classList.add(ACTIVE);
                    for (let ele of endEle) {
                        ele.removeAttribute('aria-label');
                        if (!ele.classList.contains(STARTDATE)) {
                            ele.setAttribute('aria-selected', 'false');
                            removeClass([ele], [ENDDATE, SELECTED]);
                        } else {
                            this.addSelectedAttributes(ele, this.startValue, true);
                            removeClass([ele], [ENDDATE]);
                        }
                    }
                }
                addClass([ele], ENDDATE);
                if (+this.endValue === +this.startValue) {
                    this.addSelectedAttributes(ele, this.endValue, false, true);
                } else {
                    this.addSelectedAttributes(ele, this.endValue, false);
                }
                if (ele.classList.contains(OTHERMONTH)) {
                    if (+this.endValue === +this.startValue) {
                        this.otherMonthSelect(ele, false, true);
                    } else {
                        this.otherMonthSelect(ele, false);
                    }
                }
                endEle = <Element[] & NodeListOf<Element>>this.popupObj.element.querySelectorAll('.' + ENDDATE);
                for (let ele of endEle) {
                    if (ele.classList.contains(STARTDATE)) {
                        removeClass([ele], [RANGEHOVER]);
                    }
                }
                this.applyButton.disabled = false;
                this.applyButton.element.disabled = false;
                if (!this.isMobile) {
                    this.removeClassDisabled();
                }
                this.disabledDateRender();
                this.trigger('select', this.rangeArgs(event));
            } else if (+date < +this.startValue) {
                this.removeClassDisabled();
                this.startValue = new Date('' + date);
                this.setValue();
                this.removeSelectedAttributes();
                removeClass(this.popupObj.element.querySelectorAll('.' + STARTDATE), [STARTDATE, SELECTED]);
                addClass([ele], STARTDATE);
                this.addSelectedAttributes(ele, this.startValue, true);
                if (ele.classList.contains(OTHERMONTH)) {
                    this.otherMonthSelect(ele, true);
                }
                this.checkMinMaxDays();
            }
        }


        if (event) {
            leftCalendar = <HTMLElement>closest(<HTMLElement>event.target, '.' + LEFTCALENDER);
        }
        if (!isNullOrUndefined(leftCalendar)) {
            (<HTMLElement>this.leftCalendar.children[1].firstElementChild).focus();
        } else {
            if (event) {
                rightCalendar = event && <HTMLElement>closest(<HTMLElement>event.target, '.' + RIGHTCALENDER);
            }
            if (!isNullOrUndefined(rightCalendar)) {
                (<HTMLElement>this.rightCalendar.children[1].firstElementChild).focus();
            }
        }
        addClass([ele], SELECTED);
        this.updateHeader();
        this.removeFocusedDate();
    }
    private selectableDates(): void {
        if (!isNullOrUndefined(this.startValue)) {
            let tdCells: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>this.calendarElement.querySelectorAll('.' + CALENDAR + ' td');
            let isStartDate: boolean = false;
            if (this.currentView() === 'Month') {
                for (let ele of tdCells) {
                    if (!ele.classList.contains(STARTDATE) && !ele.classList.contains(WEEKNUMBER)) {
                        if (!ele.classList.contains(DISABLED)) {
                            let eleDate: Date = this.getIdValue(null, ele);
                            if (+eleDate < +this.startValue) {
                                addClass([ele], [DATEDISABLED, DISABLED, OVERLAY]);
                                EventHandler.clearEvents(ele);
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (ele.classList.contains(STARTDATE) && !ele.classList.contains(OTHERMONTH)) {
                        isStartDate = true;
                        break;
                    }
                }
                if (isStartDate) {
                    if (!this.previousIcon.classList.contains(DISABLED)) {
                        addClass([this.previousIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                    }
                }
            } else {
                for (let ele of tdCells) {
                    let startMonth: number = this.startValue.getMonth();
                    let startYear: number = this.startValue.getFullYear();
                    let element: Date = this.getIdValue(null, ele);
                    if (!this.startButton.element.classList.contains(ACTIVE) && ((this.currentView() === 'Year' &&
                        (element.getMonth() < startMonth) && (element.getFullYear() <= startYear))
                        || (this.currentView() === 'Decade' && (element.getMonth() <= startMonth) &&
                            (element.getFullYear() < startYear)))) {
                        addClass([ele], [DISABLED]);
                    } else {
                        break;
                    }
                }
                if (tdCells[0].classList.contains(DISABLED)) {
                    this.previousIconHandler(true);
                } else if (tdCells[tdCells.length - 1].classList.contains(DISABLED)) {
                    this.nextIconHandler(true);
                }
            }
        }
    }
    private updateMinMaxDays(calendar: HTMLElement): void {
        if (!isNullOrUndefined(this.startValue) && (isNullOrUndefined(this.endValue) || this.isMobile)) {
            if ((!isNullOrUndefined(this.minDays) && this.minDays > 0) || (!isNullOrUndefined(this.maxDays) && this.maxDays > 0)) {
                let minDate: Date = new Date(new Date(+this.startValue).setDate(this.startValue.getDate() + (this.minDays - 1)));
                let maxDate: Date = new Date(new Date(+this.startValue).setDate(this.startValue.getDate() + (this.maxDays - 1)));
                minDate = (!isNullOrUndefined(this.minDays) && this.minDays > 0) ? minDate : null;
                maxDate = (!isNullOrUndefined(this.maxDays) && this.maxDays > 0) ? maxDate : null;
                let tdCells: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>calendar.querySelectorAll('.' + CALENDAR + ' td');
                let maxEle: Element;
                for (let ele of tdCells) {
                    if (!ele.classList.contains(STARTDATE) && !ele.classList.contains(WEEKNUMBER)) {
                        let eleDate: Date = this.getIdValue(null, ele);
                        if (!isNullOrUndefined(minDate) && +eleDate === +minDate && ele.classList.contains(DISABLED)) {
                            minDate.setDate(minDate.getDate() + 1);
                        }
                        if (!ele.classList.contains(DISABLED)) {
                            if (+eleDate <= +this.startValue) {
                                continue;
                            }
                            if (!isNullOrUndefined(minDate) && +eleDate < +minDate) {
                                addClass([ele], [DATEDISABLED, DISABLED, OVERLAY]);
                                EventHandler.clearEvents(ele);
                            }
                            if (!isNullOrUndefined(maxDate) && +eleDate > +maxDate) {
                                addClass([ele], [DATEDISABLED, DISABLED, OVERLAY]);
                                this.isMaxDaysClicked = true;
                                EventHandler.clearEvents(ele);
                                if (isNullOrUndefined(maxEle) && !ele.classList.contains(OTHERMONTH)) {
                                    maxEle = ele;
                                }
                            }
                        }
                    }
                }
                if (!isNullOrUndefined(maxEle)) {
                    if (this.isMobile) {
                        if (!this.nextIcon.classList.contains(DISABLED)) {
                            addClass([this.nextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                        }
                    } else {
                        let calendar: HTMLElement = <HTMLElement>closest(maxEle, '.' + RIGHTCALENDER);
                        calendar = isNullOrUndefined(calendar) ? this.leftCalendar : calendar;
                        let isLeftCalendar: boolean = calendar.classList.contains(LEFTCALENDER);
                        if (!isLeftCalendar) {
                            if (!this.rightCalNextIcon.classList.contains(DISABLED)) {
                                addClass([this.rightCalNextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                            }
                        } else {
                            if (!this.rightCalNextIcon.classList.contains(DISABLED)) {
                                addClass([this.rightCalNextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                            }
                            if (!this.leftCalNextIcon.classList.contains(DISABLED)) {
                                addClass([this.leftCalNextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                            }
                            if (!this.rightCalPrevIcon.classList.contains(DISABLED)) {
                                addClass([this.rightCalPrevIcon], [ICONDISABLED, DISABLED, OVERLAY]);
                            }
                        }
                    }
                }
            }
        } else { this.isMaxDaysClicked = false; }
    }
    private removeClassDisabled(): void {
        let tdCells: HTMLElement[];
        tdCells = <HTMLElement[] & NodeListOf<Element>>this.popupObj.element.querySelectorAll('.' + CALENDAR + ' td' + '.' + DATEDISABLED);
        for (let ele of tdCells) {
            if (ele.classList.contains(DATEDISABLED)) {
                removeClass([ele], [DATEDISABLED, DISABLED, OVERLAY]);
                EventHandler.add(ele, 'click', this.selectRange, this);
                if (!this.isMobile) {
                    EventHandler.add(ele, 'mouseover', this.hoverSelection, this);
                }
            }
        }
        if (this.isMobile) {
            if (this.nextIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.nextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
            }
            if (this.previousIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.previousIcon], [ICONDISABLED, DISABLED, OVERLAY]);
            }
        } else {
            if (this.rightCalNextIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.rightCalNextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
            }
            if (this.rightCalPrevIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.rightCalPrevIcon], [ICONDISABLED, DISABLED, OVERLAY]);
            }
            if (this.leftCalNextIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.leftCalNextIcon], [ICONDISABLED, DISABLED, OVERLAY]);
            }
        }
    }
    private updateHeader(): void {
        let format: Object = { type: 'date', skeleton: 'yMMMd' };
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            let range: number = (Math.round(Math.abs((this.startValue.getTime() - this.endValue.getTime()) / (1000 * 60 * 60 * 24))) + 1);
            if (!isNullOrUndefined(this.disabledDayCnt)) {
                range = range - this.disabledDayCnt;
                this.disabledDayCnt = null;
            }
            this.popupObj.element.querySelector('.' + DAYSPAN).textContent = range.toString() + ' ' + this.l10n.getConstant('days');
        } else {
            this.popupObj.element.querySelector('.' + DAYSPAN).textContent = this.l10n.getConstant('selectedDays');
        }
        if (!this.isMobile) {
            if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
                this.popupObj.element.querySelector('.' + ENDLABEL).textContent = this.globalize.formatDate(this.endValue, format);
            } else {
                this.popupObj.element.querySelector('.' + ENDLABEL).textContent = this.l10n.getConstant('endLabel');
            }
            if (!isNullOrUndefined(this.startValue)) {
                this.popupObj.element.querySelector('.' + STARTLABEL).textContent = this.globalize.formatDate(this.startValue, format);
            } else {
                this.popupObj.element.querySelector('.' + STARTLABEL).textContent = this.l10n.getConstant('startLabel');
            }
        } else {
            if (!isNullOrUndefined(this.startValue)) {
                this.startButton.element.textContent = this.globalize.formatDate(this.startValue, format);
            } else {
                this.startButton.element.textContent = this.l10n.getConstant('startLabel');
            }
            if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
                this.endButton.element.textContent = this.globalize.formatDate(this.endValue, format);
            } else {
                this.endButton.element.textContent = this.l10n.getConstant('endLabel');
            }
        }
        if ((this.isDateDisabled(this.startValue) || this.isDateDisabled(this.endValue)) ||
            ((!isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
                || (!isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
                || ((!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue))
                    && +this.startValue > +this.endValue)
            )) {

            if (!this.isMobile) {
                this.popupObj.element.querySelector('.' + DAYSPAN).textContent = this.l10n.getConstant('selectedDays');
                this.popupObj.element.querySelector('.' + STARTLABEL).textContent = this.l10n.getConstant('startLabel');
                this.popupObj.element.querySelector('.' + ENDLABEL).textContent = this.l10n.getConstant('endLabel');
            } else {
                this.startButton.element.textContent = this.l10n.getConstant('startLabel');
                this.endButton.element.textContent = this.l10n.getConstant('endLabel');
                this.popupObj.element.querySelector('.' + DAYSPAN).textContent = this.l10n.getConstant('selectedDays');
            }

        }
        if (this.popupObj.element.querySelector('#custom_range')) {
            this.popupObj.element.querySelector('#custom_range').textContent =
                this.l10.getConstant('customRange') !== '' ? this.l10.getConstant('customRange') : 'Custom Range';
        }
    }
    private removeSelection(): void {
        this.startValue = null;
        this.endValue = null;
        this.setValue();
        this.removeSelectedAttributes();
        if (this.popupObj) {
            if (this.popupObj.element.querySelectorAll('.' + SELECTED).length > 0) {
                removeClass(this.popupObj.element.querySelectorAll('.' + SELECTED), [STARTDATE, ENDDATE, SELECTED]);
            }
            if (this.popupObj.element.querySelectorAll('.' + FOCUSDATE).length > 0) {
                removeClass(this.popupObj.element.querySelectorAll('.' + FOCUSDATE), FOCUSDATE);
            }
            if (this.popupObj.element.querySelectorAll('.' + RANGEHOVER).length > 0) {
                removeClass(this.popupObj.element.querySelectorAll('.' + RANGEHOVER), [RANGEHOVER]);
            }
        }

    }
    private addSelectedAttributes(ele: Element, date: Date, isStartDate: boolean, sameDate?: boolean): void {
        if (ele) {
            let title: string = this.globalize.formatDate(date, { type: 'date', skeleton: 'full' });
            if (!isNullOrUndefined(sameDate) && sameDate) {
                ele.setAttribute('aria-label', 'The current start and end date is ' + '' + title);
            } else {
                ele.setAttribute('aria-label', 'The current ' + (isStartDate ? 'start' : 'end') + ' date is ' + '' + title);
            }
            ele.setAttribute('aria-selected', 'true');
        }
    }
    private removeSelectedAttributes(): void {
        if (this.popupObj) {
            let start: Element[] = <Element[] & NodeListOf<Element>>this.popupObj.element.querySelectorAll('.' + STARTDATE);
            for (let ele of start) {
                ele.setAttribute('aria-selected', 'false');
                ele.removeAttribute('aria-label');
            }
            let end: Element[] = <Element[] & NodeListOf<Element>>this.popupObj.element.querySelectorAll('.' + ENDDATE);
            for (let ele of end) {
                ele.setAttribute('aria-selected', 'false');
                ele.removeAttribute('aria-label');
            }
        }
    }
    private updateCalendarElement(calendar: HTMLElement): void {
        if (calendar.classList.contains(LEFTCALENDER)) {
            this.calendarElement = this.leftCalendar;
            this.currentDate = this.leftCalCurrentDate;
            this.previousIcon = this.leftCalPrevIcon;
            this.nextIcon = this.leftCalNextIcon;
        } else {
            this.calendarElement = this.rightCalendar;
            this.currentDate = this.rightCalCurrentDate;
            this.previousIcon = this.rightCalPrevIcon;
            this.nextIcon = this.rightCalNextIcon;
        }
        this.contentElement = <HTMLElement>calendar.querySelector('.' + CONTENT);
        this.tableBodyElement = select('.' + CONTENT + ' tbody', calendar);
        this.table = <HTMLElement>calendar.querySelector('.' + CONTENT).getElementsByTagName('table')[0];
        this.headerTitleElement = <HTMLElement>calendar.querySelector('.' + HEADER + ' .' + TITLE);
        this.headerElement = <HTMLElement>calendar.querySelector('.' + HEADER);
    }
    private navPrevMonth(e: MouseEvent): void {
        e.preventDefault();
        let ele: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + LEFTCALENDER);
        ele = isNullOrUndefined(ele) ? <HTMLElement>closest(<HTMLElement>e.target, '.' + RIGHTCALENDER) : ele;
        this.updateCalendarElement(ele);
        this.navigatePrevious(e);
        if (!isNullOrUndefined(this.startValue) && isNullOrUndefined(this.endValue)) {
            this.updateMinMaxDays(ele);
        }
        this.updateControl(ele);
    }
    private deviceNavigation(ele?: Element): void {
        this.deviceCalendarEvent();
        this.updateRange([<HTMLElement>this.popupObj.element.querySelector('.' + CALENDAR)]);
        if ((!isNullOrUndefined(this.endValue) && this.endButton.element.classList.contains(ACTIVE))) {
            this.updateMinMaxDays(<HTMLElement>this.popupObj.element.querySelector('.' + CALENDAR));
        }
        if (this.endButton.element.classList.contains(ACTIVE)) {
            this.selectableDates();
        }
        if (this.currentView() === 'Month') {
            this.bindCalendarCellEvents();
        }
        this.removeFocusedDate();
    }
    private updateControl(calendar: HTMLElement): void {
        if (calendar.classList.contains(RIGHTCALENDER)) {
            this.rightCalCurrentDate = new Date(+this.currentDate);
        } else {
            this.leftCalCurrentDate = new Date(+this.currentDate);
        }
        this.updateNavIcons();
        this.calendarIconEvent();
        if ((this.leftCalendar.querySelector('.e-content').classList.contains('e-month')
            && this.rightCalendar.querySelector('.e-content').classList.contains('e-month'))
            || this.isMobile) {
            this.bindCalendarCellEvents();
        }

        this.removeFocusedDate();
        this.updateRange([calendar]);
    }
    private navNextMonth(event: MouseEvent): void {
        event.preventDefault();
        let ele: HTMLElement = <HTMLElement>closest(<HTMLElement>event.target, '.' + LEFTCALENDER);
        ele = isNullOrUndefined(ele) ? <HTMLElement>closest(<HTMLElement>event.target, '.' + RIGHTCALENDER) : ele;
        this.updateCalendarElement(ele);
        this.navigateNext(event);
        if (!isNullOrUndefined(this.startValue) && isNullOrUndefined(this.endValue)) {
            this.updateMinMaxDays(ele);
        }
        this.updateControl(ele);
    }
    private compareMonths(start: Date, end: Date): number {
        let result: number;
        if (start.getFullYear() === end.getFullYear() &&
            (this.currentView() === 'Year' || this.currentView() === 'Decade')) {
            result = -1;
        } else if (start.getFullYear() > end.getFullYear()) {
            result = -1;
        } else if (start.getFullYear() < end.getFullYear()) {
            if (start.getFullYear() + 1 === end.getFullYear() && start.getMonth() === 11 && end.getMonth() === 0) {
                result = -1;
            } else {
                result = 1;
            }
        } else {
            result = start.getMonth() === end.getMonth() ? 0 : start.getMonth() + 1 === end.getMonth() ? -1 : 1;
        }
        return result;
    }
    private isPopupOpen(): boolean {
        if (!isNullOrUndefined(this.popupObj) && this.popupObj.element.classList.contains(POPUP)) {
            return true;
        }
        return false;
    }
    protected createRangeHeader(): HTMLElement {
        let labelContainer: HTMLElement = this.createElement('div', { className: STARTENDCONTAINER });
        if (!this.isMobile) {
            let startLabel: HTMLElement = this.createElement('a', { className: STARTLABEL });
            let endLabel: HTMLElement = this.createElement('a', { className: ENDLABEL });
            let changeIcon: HTMLElement = this.createElement('span', { className: CHANGEICON });
            attributes(startLabel, { 'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'Start Date', 'role': 'button' });
            attributes(endLabel, { 'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'End Date', 'role': 'button' });
            labelContainer.appendChild(startLabel);
            labelContainer.appendChild(changeIcon);
            labelContainer.appendChild(endLabel);
            startLabel.textContent = this.l10n.getConstant('startLabel');
            endLabel.textContent = this.l10n.getConstant('endLabel');
        } else {
            let endBtn: HTMLElement = this.createElement('button', { className: ENDBUTTON });
            let startBtn: HTMLElement = this.createElement('button', { className: STARTBUTTON });
            this.startButton = new Button({ content: this.l10n.getConstant('startLabel') }, <HTMLButtonElement>startBtn);
            this.endButton = new Button({ content: this.l10n.getConstant('endLabel') }, <HTMLButtonElement>endBtn);
            labelContainer.appendChild(startBtn);
            labelContainer.appendChild(endBtn);
        }
        return labelContainer;
    }

    private disableInput(): void {
        if (this.strictMode) {
            if (!isNullOrUndefined(this.previousStartValue) && !isNullOrUndefined(this.previousEndValue)) {
                this.startValue = this.previousStartValue;
                this.endValue = this.previousEndValue;
                this.setValue();
                this.updateInput();
            }
        } else {
            this.updateInput();
            this.clearRange();
            this.setProperties({ startDate: null }, true);
            this.setProperties({ endDate: null }, true);
            this.startValue = null;
            this.endValue = null;
            this.setValue();
            this.errorClass();
        }
        this.setProperties({ enabled: false }, true);
        Input.setEnabled(this.enabled, this.inputElement);
        this.bindEvents();
    }
    private validateMinMax(): void {
        this.min = isNullOrUndefined(this.min) || !(+this.min) ? this.min = new Date(1900, 0, 1) : this.min;
        this.max = isNullOrUndefined(this.max) || !(+this.max) ? this.max = new Date(2099, 11, 31) : this.max;
        if (!(this.min <= this.max)) {
            this.disableInput();
            return;
        }
        if (!isNullOrUndefined(this.minDays) && !isNullOrUndefined(this.maxDays)) {
            if (this.maxDays > 0 && this.minDays > 0 && (this.minDays > this.maxDays)) {
                this.maxDays = null;
            }
        }
        if (!isNullOrUndefined(this.minDays) && this.minDays < 0) {
            this.minDays = null;
        }
        if (!isNullOrUndefined(this.maxDays) && this.maxDays < 0) {
            this.maxDays = null;
        }
    }

    private validateRangeStrict(): void {
        if (!isNullOrUndefined(this.startValue)) {
            if (+this.startValue <= +this.min) {
                this.startValue = this.min;
                this.setValue();
            } else if (+this.startValue >= +this.min && +this.startValue >= +this.max) {
                this.startValue = this.max;
            }
        }
        if (!isNullOrUndefined(this.endValue)) {
            if (+this.endValue > +this.max) {
                this.endValue = this.max;
                this.setValue();
            } else if (+this.endValue < +this.min) {
                this.endValue = this.min;
                this.setValue();
            }
        }
        this.validateMinMaxDays();
    }
    private validateRange(): void {
        this.validateMinMaxDays();
    }
    private validateMinMaxDays(): void {
        if (!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) {
            let range: number = (Math.round(Math.abs((this.startValue.getTime() - this.endValue.getTime()) / (1000 * 60 * 60 * 24))) + 1);
            if ((!isNullOrUndefined(this.minDays) && this.minDays > 0) && !(range >= this.minDays)) {
                if (this.strictMode) {
                    let date: Date = new Date(+this.startValue);
                    date.setDate(date.getDate() + (this.minDays - 1));
                    if (+date > +this.max) {
                        this.endValue = this.max;
                        this.setValue();
                    } else {
                        this.endValue = date;
                        this.setValue();
                    }
                } else {
                    this.startValue = null;
                    this.endValue = null;
                    this.setValue();
                }
            }
            if ((!isNullOrUndefined(this.maxDays) && this.maxDays > 0) && !(range <= this.maxDays)) {
                if (this.strictMode) {
                    this.endValue = new Date(+this.startValue);
                    this.endValue.setDate(this.endValue.getDate() + (this.maxDays - 1));
                    this.setValue();
                } else {
                    this.startValue = null;
                    this.endValue = null;
                    this.setValue();
                }
            }
        }
    }
    private renderCalendar(): void {
        this.calendarElement = this.createElement('div');
        this.calendarElement.classList.add(CALENDAR);
        if (this.enableRtl) {
            this.calendarElement.classList.add(RTL);
        }
        attributes(this.calendarElement, <{ [key: string]: string }>{ 'role': 'calendar' });
        super.createHeader();
        super.createContent();
    }
    private isSameMonth(start: Date, end: Date): boolean {
        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            return true;
        }
        return false;
    }

    private startMonthCurrentDate(): void {
        if (this.isSameMonth(this.min, this.max) || +this.currentDate > +this.max || this.isSameMonth(this.currentDate, this.max)) {
            this.currentDate = new Date(+this.max);
            this.currentDate.setDate(1);
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        } else if (this.currentDate < this.min) {
            this.currentDate = new Date('' + this.min);
        }
    }
    private selectNextMonth(): void {
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue) && !this.isSameMonth(this.endValue, this.currentDate)
            && !this.isDateDisabled(this.endValue) && !this.isDateDisabled(this.startValue)) {
            this.currentDate = new Date(+this.endValue);
        } else {
            this.currentDate.setDate(1);
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            return;
        }
        if ((!isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
            || (!isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
            || ((!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)
        ) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            this.currentDate.setDate(1);
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        }
    }
    private selectStartMonth(): void {
        if (!isNullOrUndefined(this.startValue)) {
            if (!isNullOrUndefined(this.max) && this.isSameMonth(this.startValue, this.max)) {
                this.currentDate = new Date(+this.max);
                this.currentDate.setDate(1);
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            } else if (!(this.startValue >= this.min && this.startValue <= this.max)
                || this.isDateDisabled(this.startValue)) {
                this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            } else {
                this.currentDate = new Date(+this.startValue);
            }
        } else {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            this.startMonthCurrentDate();
        }
        if ((!isNullOrUndefined(this.endValue) && +this.endValue > +this.max)
            || (!isNullOrUndefined(this.startValue) && +this.startValue < +this.min)
            || ((!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) && +this.startValue > +this.endValue)
        ) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
        }
        this.startMonthCurrentDate();
    }
    private createCalendar(): HTMLElement {
        let calendarContainer: HTMLElement = this.createElement('div', { className: CALENDARCONTAINER });
        if (!this.isMobile) {
            this.selectStartMonth();
            this.renderCalendar();
            this.leftCalCurrentDate = new Date(+this.currentDate);
            this.calendarElement.classList.add(LEFTCALENDER);
            this.leftCalPrevIcon = <HTMLElement>this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + PREVICON);
            this.leftCalNextIcon = <HTMLElement>this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + NEXTICON);
            this.leftTitle = <HTMLElement>this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + TITLE);
            remove(this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + ICONCONTAINER));
            this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER).appendChild(this.leftCalNextIcon);
            this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER).appendChild(this.leftCalPrevIcon);
            prepend([this.leftCalPrevIcon], this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER));
            this.leftCalendar = this.calendarElement;
            let leftContainer: HTMLElement = this.createElement('div', { className: LEFTCONTAINER });
            let rightContainer: HTMLElement = this.createElement('div', { className: RIGHTCONTAINER });
            leftContainer.appendChild(this.leftCalendar);
            calendarContainer.appendChild(leftContainer);
            if (!this.isMobile) {
                EventHandler.add(this.leftTitle, 'click', this.leftNavTitle, this);
            }
            this.selectNextMonth();
            this.renderCalendar();
            this.rightCalCurrentDate = new Date(+this.currentDate);
            addClass([this.calendarElement], RIGHTCALENDER);
            this.rightCalendar = this.calendarElement;
            removeClass([this.leftCalendar && this.leftCalendar.querySelector('.e-content tbody')], 'e-zoomin');
            removeClass([this.rightCalendar && this.rightCalendar.querySelector('.e-content tbody')], 'e-zoomin');
            this.rightCalPrevIcon = <HTMLElement>this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + PREVICON);
            this.rightCalNextIcon = <HTMLElement>this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + NEXTICON);
            this.rightTitle = <HTMLElement>this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + TITLE);
            remove(this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + ICONCONTAINER));
            this.calendarElement.querySelector('table').setAttribute('tabindex', '-1');
            this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER).appendChild(this.rightCalNextIcon);
            this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER).appendChild(this.rightCalPrevIcon);
            prepend([this.rightCalPrevIcon], this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER));
            rightContainer.appendChild(this.rightCalendar);
            calendarContainer.appendChild(rightContainer);
            if (!this.isMobile) {
                EventHandler.add(this.rightTitle, 'click', this.rightNavTitle, this);
            }
        } else {
            if (!isNullOrUndefined(this.startValue)) {
                this.currentDate = new Date(+this.startValue);
            }
            super.validateDate();
            super.minMaxUpdate();
            super.render();
            let prevIcon: HTMLElement = <HTMLElement>this.calendarElement.querySelector('.' + CALENDAR + ' .' + PREVICON);
            let nextIcon: HTMLElement = <HTMLElement>this.calendarElement.querySelector('.' + CALENDAR + ' .' + NEXTICON);
            remove(this.calendarElement.querySelector('.' + CALENDAR + ' .' + ICONCONTAINER));
            this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER).appendChild(nextIcon);
            this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER).appendChild(prevIcon);
            prepend([prevIcon], this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER));
            this.deviceCalendar = this.calendarElement;
            calendarContainer.appendChild(this.calendarElement);
            this.headerTitleElement = <HTMLElement>this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER + ' .' + TITLE);
        }
        return calendarContainer;
    }
    private leftNavTitle(e: MouseEvent): void {
        if (this.isPopupOpen()) {
            this.calendarElement = this.leftCalendar;
            this.calendarNavigation(e, this.calendarElement);
        }
    }
    private calendarNavigation(e: MouseEvent | KeyboardEvent, element: HTMLElement): void {
        this.table = <HTMLElement>element.querySelector('table');
        this.headerTitleElement = <HTMLElement>element.querySelector('.e-title');
        this.tableBodyElement = <HTMLElement>element.querySelector('tbody');
        this.tableHeadElement = <HTMLElement>element.querySelector('thead');
        this.contentElement = <HTMLElement>element.querySelector('.e-content');
        this.updateCalendarElement(element);
        super.navigateTitle(e);
        this.updateNavIcons();
    }
    private rightNavTitle(e: MouseEvent): void {
        if (this.isPopupOpen()) {
            this.calendarElement = this.rightCalendar;
            this.calendarNavigation(e, this.calendarElement);
        }
    }
    protected clickEventEmitter(e: MouseEvent): void {
        if (!this.isMobile) {
            if (closest(<HTMLElement>e.target, '.e-calendar.e-left-calendar')) {
                this.calendarElement = this.leftCalendar;
                this.updateCalendarElement(this.leftCalendar);
            } else {
                this.calendarElement = this.rightCalendar;
                this.updateCalendarElement(this.rightCalendar);
            }

        }
    }
    /** 
     * Gets the current view of the Calendar.
     * @returns string
     * @private
     * @hidden
     */
    public currentView(): string {
        return super.currentView();
    }
    protected navigatedEvent(e: MouseEvent): void {
        let element: HTMLElement;
        if (this.isMobile && this.currentView() === 'Month') {
            this.bindCalendarCellEvents();
            this.deviceNavigation();
            this.removeFocusedDate();
        } else if (this.isMobile && (this.currentView() === 'Decade' || this.currentView() === 'Year')) {
            this.selectableDates();
        } else {
            if (!this.isMobile && this.currentView() === 'Month') {
                element = this.calendarElement.classList.contains('e-left-calendar') ? this.leftCalendar : this.rightCalendar;
                if (element === this.leftCalendar && ((e && !(<HTMLElement>e.currentTarget).children[0].classList.contains('e-icons'))
                    || (!isNullOrUndefined(this.controlDown)))) {
                    this.leftCalCurrentDate = new Date(+this.currentDate);
                    this.rightCalCurrentDate = new Date(new Date(+this.currentDate).setMonth(new Date(+this.currentDate).getMonth() + 1));
                    this.currentDate = this.leftCalCurrentDate;
                    this.updateCalendarElement(this.leftCalendar);
                    this.updateControl(this.leftCalendar);
                    this.updateCalendarElement(this.rightCalendar);
                    this.navigateTo('Month', this.rightCalCurrentDate);
                    this.updateControl(this.rightCalendar);
                    this.updateNavIcons();
                    this.calendarIconEvent();
                    this.calendarIconRipple();
                } else if (e && !(<HTMLElement>e.currentTarget).children[0].classList.contains('e-icons')
                    || (!isNullOrUndefined(this.controlDown))) {
                    this.rightCalCurrentDate = new Date(+this.currentDate);
                    this.leftCalCurrentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() - 1));
                    this.currentDate = this.rightCalCurrentDate;
                    this.updateCalendarElement(this.rightCalendar);
                    this.updateControl(this.rightCalendar);
                    this.updateCalendarElement(this.leftCalendar);
                    if (this.startValue && (this.startValue.getMonth() < this.rightCalCurrentDate.getMonth() &&
                        this.startValue.getFullYear() <= this.rightCalCurrentDate.getFullYear())) {
                        if (isNullOrUndefined(this.endValue)) {
                            this.effect = '';
                            this.navigateTo('Month', new Date(+this.startValue));
                        } else {
                            this.navigateTo('Month', this.leftCalCurrentDate);
                        }
                    } else {
                        this.navigateTo('Month', this.leftCalCurrentDate);
                    }
                    this.updateControl(this.leftCalendar);
                    this.updateNavIcons();
                    this.calendarIconEvent();
                    this.calendarIconRipple();
                }
            } else if (!this.isMobile && (this.currentView() === 'Decade' || this.currentView() === 'Year')) {
                this.updateNavIcons();
                this.calendarIconEvent();
            }
        }
    }
    private createControl(): void {
        let controlContainer: HTMLElement = this.createElement('div', { className: RANGECONTAINER });
        let headerContainer: HTMLElement = this.createElement('div', { className: RANGEHEADER });
        let labelContainer: HTMLElement = this.createRangeHeader();
        headerContainer.appendChild(labelContainer);
        let daySpan: HTMLElement = this.createElement('div', { className: DAYSPAN });
        attributes(daySpan, { 'aria-label': 'Selected Days' });
        daySpan.textContent = this.l10n.getConstant('selectedDays');
        headerContainer.appendChild(daySpan);
        let separator: HTMLElement = this.createElement('div', { className: SEPARATOR });
        let calendarContainer: HTMLElement = this.createCalendar();
        controlContainer.appendChild(headerContainer);
        controlContainer.appendChild(separator);
        controlContainer.appendChild(calendarContainer);
        let footerSection: HTMLElement = this.createElement('div', { className: FOOTER });
        let cancelBtn: HTMLButtonElement = <HTMLButtonElement>this.createElement('button', { className: CANCEL + ' ' + FLAT + ' ' + CSS });
        let applyBtn: HTMLButtonElement = <HTMLButtonElement>this.createElement('button');
        addClass([applyBtn], [APPLY, FLAT, PRIMARY, CSS]);
        footerSection.appendChild(applyBtn);
        footerSection.appendChild(cancelBtn);
        let enable: boolean = !isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue);
        this.cancelButton = new Button({ content: this.l10n.getConstant('cancelText') }, cancelBtn);
        this.applyButton = new Button({ content: this.l10n.getConstant('applyText'), disabled: !enable }, applyBtn);
        EventHandler.add(applyBtn, 'click', this.applyFunction, this);
        EventHandler.add(cancelBtn, 'click', this.cancelFunction, this);
        this.popupWrapper.appendChild(controlContainer);
        if (!this.isMobile) {
            if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
                this.createPresets();
                this.listRippleEffect();
                addClass([controlContainer], RANGEBORDER);
                addClass([this.popupWrapper], 'e-preset-wrapper');
                let presets: HTMLElement = <HTMLElement>this.popupWrapper.querySelector('.' + PRESETS);
                presets.style.height = this.popupWrapper.querySelector('.' + RANGECONTAINER).getBoundingClientRect().height + 'px';
            }
        }
        this.popupWrapper.appendChild(footerSection);
        if (this.isMobile) {
            this.deviceHeaderUpdate();
        }
        this.renderPopup();
    }
    private cancelFunction(eve?: MouseEvent): void {
        if (document.activeElement !== this.inputElement) {
            this.preventFocus = true;
            this.inputElement.focus();
            addClass([this.inputWrapper.container], [INPUTFOCUS]);
        }
        eve.preventDefault();
        if (this.isKeyPopup) {
            this.inputElement.focus();
            this.isKeyPopup = false;
        }
        this.startValue = null;
        this.endValue = null;
        this.removeSelection();
        this.hide(eve);
    }
    private deviceHeaderUpdate(): void {
        if (isNullOrUndefined(this.startValue) && isNullOrUndefined(this.endValue)) {
            this.endButton.element.setAttribute('disabled', '');
            this.startButton.element.classList.add(ACTIVE);
        } else if (!isNullOrUndefined(this.startValue)) {
            this.startButton.element.classList.add(ACTIVE);
        }
    }
    private applyFunction(eve?: MouseEvent | KeyboardEventArgs): void {
        eve.preventDefault();
        if (this.closeEventArgs && this.closeEventArgs.cancel) {
            this.startValue = this.popupWrapper.querySelector('.e-start-date') &&
                this.getIdValue(null, this.popupWrapper.querySelector('.e-start-date'));
            this.endValue = this.popupWrapper.querySelector('.e-end-date') &&
                this.getIdValue(null, this.popupWrapper.querySelector('.e-end-date'));
            this.setValue();
        }
        if (document.activeElement !== this.inputElement) {
            this.preventFocus = true;
            this.inputElement.focus();
            addClass([this.inputWrapper.container], [INPUTFOCUS]);
        }
        if (eve.type !== 'touchstart' &&
            this.closeEventArgs && !this.closeEventArgs.cancel) { eve.preventDefault(); }
        if (!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) {
            this.previousStartValue = new Date(+this.startValue);
            this.previousEndValue = new Date(+this.endValue);
            this.previousEleValue = this.inputElement.value;
            Input.setValue(this.rangeArgs(eve).text, this.inputElement, this.floatLabelType, this.showClearButton);
            this.changeTrigger(eve);
            this.hide(eve ? eve : null);
            this.errorClass();
        } else {
            this.hide(eve ? eve : null);
        }
        if (!this.isMobile) {
            this.isKeyPopup = false;
            if (this.isRangeIconClicked) {
                (<HTMLElement>this.inputWrapper.container.children[1]).focus();
                this.popupKeyboardModule = new KeyboardEvents(
                    <HTMLElement>this.inputWrapper.container.children[1],
                    {
                        eventName: 'keydown',
                        keyAction: this.popupKeyActionHandle.bind(this),
                        keyConfigs: this.keyInputConfigs
                    });
            }
        }
    }
    private onMouseClick(event: MouseEvent | KeyboardEventArgs, item?: Element): void {
        if (event.type === 'touchstart') {
            return;
        }
        let target: Element = item || <Element>event.target;
        let li: HTMLElement = <HTMLElement>closest(target, '.' + LISTCLASS);
        let isClick: boolean = li && li.classList.contains(ACTIVE);
        if (li && li.classList.contains(LISTCLASS)) {
            this.setListSelection(li, event);
        }
        this.inputElement.focus();
        if (!this.isMobile) {
            this.preventFocus = true;
            if (li && li.classList.contains(LISTCLASS) && li.getAttribute('id') === 'custom_range') {
                (<HTMLElement>this.leftCalendar.children[1].firstElementChild).focus();
            } else {
                if (!isClick && event.type === 'keydown') { this.inputElement.focus(); }
            }
        }
    }
    private onMouseOver(event: MouseEvent): void {
        let li: HTMLElement = <HTMLElement>closest(<Element>event.target, '.' + LISTCLASS);
        if (li && li.classList.contains(LISTCLASS) && !li.classList.contains(HOVER)) {
            addClass([li], HOVER);
        }
    }
    private onMouseLeave(event: MouseEvent): void {
        let item: HTMLElement = <HTMLElement>closest(<Element>event.target, '.' + HOVER);
        if (!isNullOrUndefined(item)) {
            removeClass([item], HOVER);
        }
    }
    private setListSelection(li: HTMLElement, event: MouseEvent | KeyboardEventArgs): void {
        if (li && (!li.classList.contains(ACTIVE) || (this.isMobile && li.classList.contains(ACTIVE)))) {
            if (this.isMobile && li.classList.contains(ACTIVE)) {
                this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(li);
                let values: { [key: string]: Object } = this.presetsItem[this.activeIndex];
                if (values.id === 'custom_range') {
                    this.renderCustomPopup();
                    return;
                }
                return;
            }
            this.removeListSelection();
            this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(li);
            addClass([li], ACTIVE);
            li.setAttribute('aria-selected', 'true');
            let values: { [key: string]: Object } = this.presetsItem[this.activeIndex];
            if (values.id === 'custom_range') {
                this.renderCustomPopup();
            } else {
                this.applyPresetRange(values);
            }
        }
    }
    private removeListSelection(): void {
        let item: HTMLElement = <HTMLElement>this.presetElement.querySelector('.' + ACTIVE);
        if (!isNullOrUndefined(item)) {
            removeClass([item], ACTIVE);
            item.removeAttribute('aria-selected');
        }
    }
    private setValue(): void {
        this.modelValue = [this.startValue, this.endValue];
    }
    private applyPresetRange(values: { [key: string]: Object }): void {
        this.hide(null);
        this.presetsItem[this.presetsItem.length - 1].start = null;
        this.presetsItem[this.presetsItem.length - 1].end = null;
        this.startValue = <Date>values.start;
        this.endValue = <Date>values.end;
        this.setValue();
        this.refreshControl();
        this.trigger('select', this.rangeArgs(null));
        this.changeTrigger();
        this.previousEleValue = this.inputElement.value;
        this.isCustomRange = false;
        this.leftCalendar = this.rightCalendar = null;
        if (this.isKeyPopup) {
            this.isRangeIconClicked = false;
            this.inputElement.focus();
        }
    }
    private showPopup(element?: HTMLElement, event?: MouseEvent | KeyboardEventArgs | Event): void {
        this.presetHeight();
        if (this.zIndex === 1000) {
            this.popupObj.show(null, this.element);
        } else {
            this.popupObj.show(null, null);
        }
        if (this.isMobile) {
            this.popupObj.refreshPosition();
        }

    }
    private renderCustomPopup(): void {
        this.isCustomWindow = true;
        this.popupObj.hide();
        this.popupWrapper = this.createElement('div', { id: this.element.id + '_popup', className: ROOT + ' ' + POPUP });
        this.renderControl();
        this.openEventArgs.appendTo.appendChild(this.popupWrapper);
        this.showPopup();
        this.isCustomRange = true;
        if (!this.isMobile) {
            this.calendarFocus();
        }
    }
    private listRippleEffect(): void {
        for (let li of this.liCollections) {
            rippleEffect(li);
        }
    }
    private createPresets(): void {
        if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
            this.presetElement = this.createElement('div', { className: PRESETS, attrs: { 'tabindex': '0' } });
            let listTag: HTMLElement = ListBase.createList(this.createElement, this.presetsItem, null, true);
            attributes(listTag, { 'role': 'listbox', 'aria-hidden': 'false', 'id': this.element.id + '_options' });
            this.presetElement.appendChild(listTag);
            this.popupWrapper.appendChild(this.presetElement);
            this.liCollections = <HTMLElement[] & NodeListOf<Element>>this.presetElement.querySelectorAll('.' + LISTCLASS);
            this.wireListEvents();
            if (this.isMobile) {
                this.presetElement.style.width = this.inputWrapper.container.getBoundingClientRect().width + 'px';
            }
            if (!isNullOrUndefined(this.activeIndex) && this.activeIndex > -1) {
                addClass([this.liCollections[this.activeIndex]], ACTIVE);
            }
        }
    }
    private wireListEvents(): void {
        EventHandler.add(this.presetElement, 'click', this.onMouseClick, this);
        if (!this.isMobile) {
            EventHandler.add(this.presetElement, 'mouseover', this.onMouseOver, this);
            EventHandler.add(this.presetElement, 'mouseout', this.onMouseLeave, this);
        }
    }
    private unWireListEvents(): void {
        if (!isNullOrUndefined(this.presetElement)) {
            EventHandler.remove(this.presetElement, 'click touchstart', this.onMouseClick);
            if (!this.isMobile) {
                EventHandler.remove(this.presetElement, 'mouseover', this.onMouseOver);
                EventHandler.remove(this.presetElement, 'mouseout', this.onMouseLeave);
            }
        }
    }
    // tslint:disable-next-line:max-func-body-length
    private renderPopup(): void {
        this.popupWrapper.classList.add('e-control');
        let popupWidth: number = this.popupWrapper.getBoundingClientRect().width;
        if (!isNullOrUndefined(this.cssClass) && this.cssClass.trim() !== '') { this.popupWrapper.className += ' ' + this.cssClass; }
        if (this.isMobile && this.isCustomWindow) {
            this.modal = this.createElement('div');
            document.body.appendChild(this.modal);
        }
        this.popupObj = new Popup(this.popupWrapper as HTMLElement, {
            relateTo: this.isMobile && this.isCustomWindow ? document.body :
                (!isNullOrUndefined(this.targetElement) ? this.targetElement : this.inputWrapper.container),
            position: (this.isMobile ?
                (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && !this.isCustomWindow ?
                    { X: 'left', Y: 'bottom' } : { X: 'center', Y: 'center' }) :
                this.enableRtl ? { X: 'left', Y: 'bottom' } : { X: 'right', Y: 'bottom' }),
            offsetX: this.isMobile || this.enableRtl ? 0 : -popupWidth,
            offsetY: OFFSETVALUE,
            collision: this.isMobile ?
                (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && !this.isCustomWindow ?
                    { X: 'fit' } : { X: 'fit', Y: 'fit' }) : { X: 'fit', Y: 'flip' },
            targetType: this.isMobile && this.isCustomWindow ? 'container' : 'relative',
            enableRtl: this.enableRtl,
            zIndex: this.zIndex,
            open: () => {
                attributes(this.inputElement, { 'aria-expanded': 'true' });
                addClass([this.inputWrapper.buttons[0]], ACTIVE);
                if (!this.isMobile) {
                    if (this.cancelButton) {
                        this.btnKeyboardModule = new KeyboardEvents(
                            <HTMLElement>this.cancelButton.element,
                            {
                                eventName: 'keydown',
                                keyAction: this.popupKeyActionHandle.bind(this),
                                keyConfigs: { tab: 'tab', altRightArrow: 'alt+rightarrow', altLeftArrow: 'alt+leftarrow' }
                            });
                        this.btnKeyboardModule = new KeyboardEvents(
                            <HTMLElement>this.applyButton.element,
                            {
                                eventName: 'keydown',
                                keyAction: this.popupKeyActionHandle.bind(this),
                                keyConfigs: { altRightArrow: 'alt+rightarrow', altLeftArrow: 'alt+leftarrow' }
                            });
                    }
                    if (!isNullOrUndefined(this.leftCalendar)) {
                        if (!this.isRangeIconClicked) {
                            this.calendarFocus();
                        }
                    }
                    if (!isNullOrUndefined(this.presetElement)) {
                        this.presetKeyboardModule = new KeyboardEvents(
                            <HTMLElement>this.presetElement,
                            {
                                eventName: 'keydown',
                                keyAction: this.presetKeyActionHandler.bind(this),
                                keyConfigs: this.presetKeyConfig
                            });
                        this.presetKeyboardModule = new KeyboardEvents(
                            <HTMLElement>this.presetElement,
                            {
                                eventName: 'keydown',
                                keyAction: this.popupKeyActionHandle.bind(this),
                                keyConfigs: { altRightArrow: 'alt+rightarrow', altLeftArrow: 'alt+leftarrow' }
                            });
                        if (isNullOrUndefined(this.leftCalendar)) {
                            this.preventBlur = true;
                            this.presetElement.focus();
                        } else {
                            this.presetElement.setAttribute('tabindex', '-1');
                        }
                    }
                    this.popupKeyBoardHandler();
                }
                if (this.isMobile && !Browser.isDevice) {
                    EventHandler.add(document, 'keydown', this.popupCloseHandler, this);
                }
            },
            close: () => {
                attributes(this.inputElement, { 'aria-expanded': 'false' });
                removeClass([this.inputWrapper.buttons[0]], ACTIVE);
                if (this.isRangeIconClicked) {
                    (this.inputWrapper.container.children[1] as HTMLElement).focus();
                }
                if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
                    this.unWireListEvents();
                }
                if (!isNullOrUndefined(this.popupObj)) {
                    detach(this.popupObj.element);
                    this.popupObj.destroy();
                    this.popupObj = null;
                }
                if (this.isMobile && !Browser.isDevice) {
                    EventHandler.remove(document, 'keydown', this.popupCloseHandler);
                }
            }
        });

        if (this.isMobile) {
            this.popupObj.element.classList.add(DEVICE);
            if (!this.isMobile) {
                this.popupObj.element.classList.add('e-bigger');
            }
        }
        if (this.isMobile && this.isCustomWindow) {
            addClass([this.modal], [DEVICE, ROOT, 'e-range-modal']);
            document.body.className += ' ' + OVERFLOW;
            this.modal.style.display = 'block';
        }
        EventHandler.add(document, 'mousedown', this.documentHandler, this);
    }

    protected popupCloseHandler(e: KeyboardEventArgs): void {
        switch (e.keyCode) {
            case 27:
                this.hide(e);
                break;
        }
    }

    private calendarFocus(): void {
        let startDate: Element = this.popupObj && this.popupObj.element.querySelector('.' + STARTDATE);
        if (startDate) {
            let ele: HTMLElement = <HTMLElement>closest(startDate, '.' + RIGHTCALENDER);
            ele = isNullOrUndefined(ele) ? this.leftCalendar : ele;
            if (this.isRangeIconClicked) {
                (<HTMLElement>this.inputWrapper.container).focus();
            } else {
                this.preventBlur = true;
                (<HTMLElement>ele.children[1].firstElementChild).focus();
            }
            addClass([startDate], FOCUSDATE);
        } else {
            if (this.isRangeIconClicked) {
                (<HTMLElement>this.inputWrapper.container).focus();
            } else {
                this.preventBlur = true;
                (<HTMLElement>this.leftCalendar.children[1].firstElementChild).focus();
            }

        }
    }
    private presetHeight(): void {
        let presets: HTMLElement = this.popupObj && <HTMLElement>this.popupObj.element.querySelector('.' + PRESETS);
        let rangeContainer: HTMLElement = this.popupObj && <HTMLElement>this.popupObj.element.querySelector('.' + RANGECONTAINER);
        if (!isNullOrUndefined(presets) && !isNullOrUndefined(rangeContainer)) {
            presets.style.height = rangeContainer.getBoundingClientRect().height + 'px';
        }
    }
    private presetKeyActionHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
            case 'moveDown':
                this.listMoveDown(e);
                this.setScrollPosition();
                e.preventDefault();
                break;
            case 'moveUp':
                this.listMoveUp(e);
                this.setScrollPosition();
                e.preventDefault();
                break;
            case 'enter':
                let hvrItem: HTMLElement = this.getHoverLI();
                let actItem: HTMLElement = this.getActiveLI();
                if (!isNullOrUndefined(this.leftCalendar) && !isNullOrUndefined(actItem)) {
                    if (isNullOrUndefined(hvrItem) || (!isNullOrUndefined(actItem) && actItem === hvrItem)) {
                        this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(actItem);
                        let values: { [key: string]: Object } = this.presetsItem[this.activeIndex];
                        if (values.id === 'custom_range') {
                            this.calendarFocus();
                            actItem.classList.remove(HOVER);
                            e.preventDefault();
                            return;
                        }
                    }
                }
                if (!isNullOrUndefined(hvrItem) || !isNullOrUndefined(actItem)) {
                    this.onMouseClick(e, hvrItem || actItem);
                }
                e.preventDefault();
                break;
            case 'tab':
                if (this.leftCalendar) {
                    let item: HTMLElement = this.getHoverLI();
                    if (!isNullOrUndefined(item)) {
                        item.classList.remove(HOVER);
                    }
                } else {
                    this.hide(e);
                    e.preventDefault();
                }
                break;
        }
    }
    private listMoveDown(e: KeyboardEventArgs): void {
        let hvrItem: HTMLElement = this.getHoverLI();
        let actItem: HTMLElement = this.getActiveLI();
        if (!isNullOrUndefined(hvrItem)) {
            let li: HTMLElement = <HTMLElement>hvrItem.nextElementSibling;
            if (!isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                removeClass([hvrItem], HOVER);
                addClass([li], HOVER);
            }
        } else if (!isNullOrUndefined(actItem)) {
            let li: HTMLElement = <HTMLElement>actItem.nextElementSibling;
            if (!isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                addClass([li], HOVER);
            }
        } else {
            addClass([this.liCollections[0]], HOVER);
        }
    }
    private listMoveUp(e: KeyboardEventArgs): void {
        let hvrItem: HTMLElement = this.getHoverLI();
        let actItem: HTMLElement = this.getActiveLI();
        if (!isNullOrUndefined(hvrItem)) {
            let li: HTMLElement = <HTMLElement>hvrItem.previousElementSibling;
            if (!isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                removeClass([hvrItem], HOVER);
                addClass([li], HOVER);
            }
        } else if (!isNullOrUndefined(actItem)) {
            let li: HTMLElement = <HTMLElement>actItem.previousElementSibling;
            if (!isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                addClass([li], HOVER);
            }
        }
    }
    private getHoverLI(): HTMLElement {
        let item: HTMLElement = <HTMLElement>this.presetElement.querySelector('.' + HOVER);
        return item;
    }
    private getActiveLI(): HTMLElement {
        let item: HTMLElement = <HTMLElement>this.presetElement.querySelector('.' + ACTIVE);
        return item;
    }
    private popupKeyBoardHandler(): void {
        this.popupKeyboardModule = new KeyboardEvents(
            <HTMLElement>this.popupWrapper,
            {
                eventName: 'keydown',
                keyAction: this.popupKeyActionHandle.bind(this),
                keyConfigs: { escape: 'escape' }
            });
        this.popupKeyboardModule = new KeyboardEvents(
            <HTMLElement>this.inputWrapper.container.children[1],
            {
                eventName: 'keydown',
                keyAction: this.popupKeyActionHandle.bind(this),
                keyConfigs: this.keyInputConfigs
            });
    }
    private setScrollPosition(): void {
        let listHeight: number = this.presetElement.getBoundingClientRect().height;
        let hover: HTMLElement = <HTMLElement>this.presetElement.querySelector('.' + HOVER);
        let active: HTMLElement = <HTMLElement>this.presetElement.querySelector('.' + ACTIVE);
        let element: HTMLElement = !isNullOrUndefined(hover) ? hover : active;
        if (!isNullOrUndefined(element)) {
            let nextEle: Element = element.nextElementSibling;
            let height: number = nextEle ? (<HTMLElement>nextEle).offsetTop : element.offsetTop;
            let liHeight: number = element.getBoundingClientRect().height;
            if ((height + element.offsetTop) > listHeight) {
                this.presetElement.scrollTop = nextEle ? (height - (listHeight / 2 + liHeight / 2)) : height;
            } else {
                this.presetElement.scrollTop = 0;
            }
        }
    }
    private popupKeyActionHandle(e: KeyboardEventArgs): void {
        let presetElement: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, '.' + PRESETS);
        switch (e.action) {
            case 'escape':
                if (this.isPopupOpen()) {
                    if (this.isKeyPopup) {
                        this.inputElement.focus();
                        this.isKeyPopup = false;
                    }
                    this.hide(e);
                } else {
                    (this.inputWrapper.container.children[1] as HTMLElement).blur();
                }
                break;
            case 'enter':
                if (!this.isPopupOpen()) {
                    this.show(null, e);
                } else {
                    (this.inputWrapper.container.children[1] as HTMLElement).focus();
                }
                break;
            case 'tab':
                this.hide(e);
                break;
            case 'altRightArrow':
                if (!isNullOrUndefined(presetElement)) {
                    this.cancelButton.element.focus();
                } else {
                    if (document.activeElement === this.cancelButton.element && this.applyButton.element.disabled !== true) {
                        this.applyButton.element.focus();
                    } else {
                        (<HTMLElement>this.leftCalendar.children[1].firstElementChild).focus();
                    }
                }
                e.preventDefault();
                break;
            case 'altLeftArrow':
                if (!isNullOrUndefined(presetElement)) {
                    (<HTMLElement>this.rightCalendar.children[1].firstElementChild).focus();
                } else {
                    if (document.activeElement === this.applyButton.element && this.applyButton.element.disabled !== true) {
                        this.cancelButton.element.focus();
                    } else {
                        if (!isNullOrUndefined(this.presetElement) && (document.activeElement === this.cancelButton.element)) {
                            this.presetElement.focus();
                        } else {
                            (<HTMLElement>this.rightCalendar.children[1].firstElementChild).focus();
                        }
                    }
                }
                e.preventDefault();
                break;
        }
    }
    private documentHandler(e: MouseEvent): void {
        if (isNullOrUndefined(this.popupObj)) {
            return;
        }
        let target: HTMLElement = <HTMLElement>e.target;
        if (!this.inputWrapper.container.contains(target as Node) ||
            (!isNullOrUndefined(this.popupObj) && !closest(target, this.popupWrapper.id))) {
            if ((e.type === 'touchstart' || e.type === 'mousedown') ||
                this.closeEventArgs && !this.closeEventArgs.cancel) { e.preventDefault(); }
        }
        if ((isNullOrUndefined(this.targetElement) ||
            (!isNullOrUndefined(this.targetElement) && !(target === this.targetElement))) &&
            !(closest(target, '#' + this.popupObj.element.id))
            && !(closest(target, '.' + INPUTCONTAINER) === this.inputWrapper.container)
            && !(closest(target, '.e-daterangepicker.e-popup') && (!target.classList.contains('e-day')))) {
            this.preventBlur = false;
            if (this.isPopupOpen()) {
                this.applyFunction(e);
                if (!this.isMobile) { this.isRangeIconClicked = false; }
            }
        }
    }
    private createInput(): void {
        this.inputWrapper = Input.createInput(
            {
                floatLabelType: this.floatLabelType,
                element: this.inputElement,
                properties: {
                    readonly: this.readonly,
                    placeholder: this.placeholder,
                    cssClass: this.cssClass,
                    enabled: this.enabled,
                    enableRtl: this.enableRtl,
                    showClearButton: this.showClearButton,
                },
                buttons: [DATERANGEICON]
            },
            this.createElement
        );
        attributes(this.inputElement, {
            'aria-readonly': this.readonly ? 'true' : 'false', 'tabindex': '1', 'aria-haspopup': 'true',
            'aria-activedescendant': 'null', 'aria-owns': this.element.id + '_popup', 'aria-expanded': 'false',
            'role': 'daterangepicker', 'autocomplete': 'off', 'aria-disabled': !this.enabled ? 'true' : 'false',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false'
        });
        Input.addAttributes({ 'aria-label': 'select' }, this.inputWrapper.buttons[0]);
        if (!isNullOrUndefined(this.placeholder) && this.placeholder.trim() !== '') {
            Input.addAttributes({ 'aria-placeholder': this.placeholder }, this.inputElement);
        }
        this.setEleWidth(this.width);
        addClass([this.inputWrapper.container], DATERANGEWRAPPER);
        if (isNullOrUndefined(this.inputElement.getAttribute('name'))) {
            attributes(this.inputElement, { 'name': this.element.id });
        }
        if (this.inputElement.type === 'hidden') {
            this.inputWrapper.container.style.display = 'none';
        }
        this.refreshControl();
        this.previousEleValue = this.inputElement.value;
    }

    private setEleWidth(width: number | string): void {
        if (typeof width === 'string') {
            this.inputWrapper.container.style.width = <string>(this.width);
        } else if (typeof width === 'number') {
            this.inputWrapper.container.style.width = formatUnit(this.width);
        } else {
            this.inputWrapper.container.style.width = '100%';
        }
    }
    private refreshControl(): void {
        this.validateMinMax();

        if (this.strictMode) {
            this.validateRangeStrict();
        }
        let isDisabled: boolean = this.disabledDates();
        if (this.strictMode && (isDisabled)) {
            this.startValue = this.previousStartValue;
            this.setProperties({ startDate: this.startValue }, true);
            this.endValue = this.previousEndValue;
            this.setProperties({ endDate: this.endValue }, true);
            this.setValue();
        }
        this.updateInput();
        if (!this.strictMode) {
            this.validateRange();
        }
        if (!this.strictMode && (isDisabled)) {
            this.clearRange();

        }
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue) && !isDisabled) {
            this.disabledDateRender();
        }
        this.errorClass();
        this.previousStartValue = isNullOrUndefined(this.startValue) || isNaN(+this.startValue) ? null : new Date(+this.startValue);
        this.previousEndValue = isNullOrUndefined(this.endValue) || isNaN(+this.endValue) ? null : new Date(+this.endValue);
    }
    private updateInput(): void {
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            let startDate: string = this.globalize.formatDate(this.startValue, { format: this.format, type: 'date', skeleton: 'yMd' });
            let endDate: string = this.globalize.formatDate(this.endValue, { format: this.format, type: 'date', skeleton: 'yMd' });
            Input.setValue(startDate + ' ' + this.separator + ' ' + endDate, this.inputElement, this.floatLabelType, this.showClearButton);
            this.previousStartValue = new Date(+this.startValue);
            this.previousEndValue = new Date(+this.endValue);
        }
    }
    private isDateDisabled(date: Date): boolean {
        if (isNullOrUndefined(date)) {
            return false;
        }
        let value: Date = new Date(+date);
        if (+value < +this.min || +value > +this.max) {
            return true;
        }
        this.virtualRenderCellArgs = {
            date: value,
            isDisabled: false,
        };
        let args: RenderDayCellEventArgs = this.virtualRenderCellArgs;
        this.virtualRenderCellEvent(args);
        if (args.isDisabled) {
            return true;
        }
        return false;
    }
    private disabledDateRender(): void {
        this.disabledDays = [];
        this.disabledDayCnt = null;
        let localDate: Date = new Date(+this.startValue);
        let count: number = 0;
        while (+ localDate <= +this.endValue) {
            this.virtualRenderCellArgs = {
                date: localDate,
                isDisabled: false,
            };
            let args: RenderDayCellEventArgs = this.virtualRenderCellArgs;
            this.virtualRenderCellEvent(args);
            if (args.isDisabled) {
                this.disabledDays.push(new Date(+args.date));
                if (+localDate > +this.startValue && +localDate < +this.endValue) {
                    count++;
                }
            }
            this.addDay(localDate, 1, null, this.max, this.min);
        }
        this.disabledDayCnt = count;
    }
    private virtualRenderCellEvent(args: RenderDayCellEventArgs): void {
        extend(this.virtualRenderCellArgs, { name: 'renderDayCell' });
        this.trigger('renderDayCell', args);
    }
    private disabledDates(): boolean {
        let isStartDisabled: boolean = false;
        let isEndDisabled: boolean = false;
        if (!isNullOrUndefined(this.endValue) && !isNullOrUndefined(this.startValue)) {
            isStartDisabled = this.isDateDisabled(this.startValue);
            isEndDisabled = this.isDateDisabled(this.endValue);
            this.currentDate = null;
            this.setValue();
        }
        return (isStartDisabled || isEndDisabled);
    }
    private setModelValue(): void {
        if (!this.value && this.startDate === null && this.endDate === null) {
            this.setProperties({ value: null }, true);
        } else if (this.value === null || (<DateRange>this.value).start === null) {
            if (this.value === null) {
                this.setProperties({ value: [this.startDate, this.endDate] }, true);
            } else if ((<DateRange>this.value).start === null) {
                this.setProperties({ value: { start: this.startDate, end: this.endDate } }, true);
            }
        } else {
            if ((this.value && (<Date[]>this.value).length > 0) ||
                this.valueType && (<Date[]>this.valueType).length > 0) {
                if (+this.startDate !== +(<Date[]>this.value)[0] || +this.endDate !== +(<Date[]>this.value)[1]) {
                    this.setProperties({ value: [this.startDate, this.endDate] }, true);
                }
                if (this.value && (<Date[]>this.value)[0] == null && (<Date[]>this.value)[1] == null) {
                    this.setProperties({ value: null }, true);
                }
            } else {
                if ((this.value && (<DateRange>this.value).start)) {
                    this.setProperties({ value: { start: this.startDate, end: this.endDate } }, true);
                }
            }
        }
        this.createHiddenInput();
    }

    /**
     * To dispatch the event manually 
     */
    protected dispatchEvent(element: HTMLElement, type: string): void {
        let evt: Event = document.createEvent('HTMLEvents');
        evt.initEvent(type, false, true);
        element.dispatchEvent(evt);
        this.firstHiddenChild.dispatchEvent(evt);
    }

    private changeTrigger(e?: MouseEvent | KeyboardEvent): void {
        if (+ this.initStartDate !== +this.startValue || +this.initEndDate !== +this.endValue) {
            this.setProperties({ endDate: this.checkDateValue(this.endValue) }, true);
            this.setProperties({ startDate: this.checkDateValue(this.startValue) }, true);
            this.setModelValue();
            this.trigger('change', this.rangeArgs(e));
        }
        this.previousEleValue = this.inputElement.value;
        this.initStartDate = this.checkDateValue(this.startValue);
        this.initEndDate = this.checkDateValue(this.endValue);
    }
    /** 
     * This method is used to navigate to the month/year/decade view of the Calendar.
     * @param  {string} view - Specifies the view of the Calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns void
     * @hidden
     */
    public navigateTo(view: CalendarView, value: Date): void {
        super.navigateTo(view, value);
    }

    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    public focusIn(): void {
        if (document.activeElement !== this.inputElement && this.enabled) {
            addClass([this.inputWrapper.container], [INPUTFOCUS]);
            (<HTMLElement>this.inputElement).focus();
            let focusArguments: FocusEventArgs = {
                model: this
            };
            this.trigger('focus', focusArguments);
        }
    }
    /**
     * Remove the focus from widget, if the widget is in focus state. 
     * @returns void
     */
    public focusOut(): void {
        let isBlur: boolean = this.preventBlur;
        if (document.activeElement === this.inputElement) {
            removeClass([this.inputWrapper.container], [INPUTFOCUS]);
            this.preventBlur = false;
            this.inputElement.blur();
            this.preventBlur = isBlur;
        }
    }
    /**
     * To destroy the widget.    
     * @returns void
     */
    public destroy(): void {
        this.hide(null);
        let ariaAttrs: object = {
            'aria-readonly': this.readonly ? 'true' : 'false', 'tabindex': '1', 'aria-haspopup': 'true',
            'aria-activedescendant': 'null', 'aria-owns': this.element.id + '_popup', 'aria-expanded': 'false',
            'role': 'daterangepicker', 'autocomplete': 'off', 'aria-disabled': !this.enabled ? 'true' : 'false',
            'autocorrect': 'off', 'autocapitalize': 'off', 'aria-invalid': 'false', 'spellcheck': 'false'
        };
        if (this.inputElement) {
            removeClass([this.inputElement], [ROOT]);
            EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            Input.removeAttributes(<{ [key: string]: string }>ariaAttrs, this.inputElement);
            this.ensureInputAttribute();
            this.inputElement.classList.remove('e-input');
            if (!isNullOrUndefined(this.inputWrapper)) {
                EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown', this.rangeIconHandler);
                if (this.angularTag === null) {
                    this.inputWrapper.container.parentElement.appendChild(this.inputElement);
                }
                detach(this.inputWrapper.container);
            }
        }
        if (!isNullOrUndefined(this.inputKeyboardModule) && !this.isMobile) {
            this.inputKeyboardModule.destroy();
        }
        if (this.popupObj) {
            if (!this.isMobile) {
                this.clearCalendarEvents();
            }
        }
        super.destroy();
        this.inputWrapper = this.popupWrapper = this.popupObj = this.cloneElement = this.presetElement = null;
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
        if ((!isNullOrUndefined(this.firstHiddenChild))
            && (!isNullOrUndefined(this.secondHiddenChild))) {
            detach(this.firstHiddenChild);
            detach(this.secondHiddenChild);
            this.firstHiddenChild = this.secondHiddenChild = null;
            this.inputElement.setAttribute('name', this.element.getAttribute('data-name'));
            this.inputElement.removeAttribute('data-name');
        }
    }
    protected ensureInputAttribute(): void {
        for (let attr: number = 0; attr < this.inputElement.attributes.length; attr++) {
            let prop: string = this.inputElement.attributes[attr].name;
            if (isNullOrUndefined(this.cloneElement.getAttribute(prop))) {
                if (prop.toLowerCase() === 'value' || isNullOrUndefined(this.cloneElement.getAttribute('value'))) {
                    this.inputElement.value = '';
                }
                this.inputElement.removeAttribute(prop);
            }
        }
    }
    /**
     * To get component name  
     * @returns string
     * @private
     */
    protected getModuleName(): string {
        return 'daterangepicker';
    }
    /**
     * Return the properties that are maintained upon browser refresh.
     * @returns string
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['startDate', 'endDate', 'value'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Return the selected range and day span in the DateRangePicker.
     * @returns Object
     */
    public getSelectedRange(): Object {
        let range: number;
        if (!isNullOrUndefined(this.startValue) && !isNullOrUndefined(this.endValue)) {
            range = (Math.round(Math.abs((this.startValue.getTime() - this.endValue.getTime()) / (1000 * 60 * 60 * 24))) + 1);
            this.disabledDateRender();
            if (!isNullOrUndefined(this.disabledDayCnt)) {
                range = range - this.disabledDayCnt;
                this.disabledDayCnt = null;
            }
        } else {
            range = 0;
        }
        return { startDate: this.startValue, endDate: this.endValue, daySpan: range };
    }
    /**
     * To open the Popup container in the DateRangePicker component.
     * @returns void
     */
    public show(element?: HTMLElement, event?: MouseEvent | KeyboardEventArgs | Event): void {
        if (this.isMobile && this.popupObj) {
            this.popupObj.refreshPosition();
        }
        if ((this.enabled && this.readonly) || !this.enabled || this.popupObj) {
            return;
        } else {
            if (!this.isPopupOpen()) {
                if (element) {
                    this.targetElement = element;
                }
                this.createPopup();
                this.openEventArgs = {
                    popup: this.popupObj || null,
                    cancel: false,
                    date: this.inputElement.value,
                    model: this,
                    event: event ? event : null,
                    appendTo: document.body
                };
                this.trigger('open', this.openEventArgs);
                if (!this.openEventArgs.cancel) {
                    this.openEventArgs.appendTo.appendChild(this.popupWrapper);
                    this.showPopup(element, event);
                    let isPreset: boolean = (!this.isCustomRange || (this.isMobile && this.isCustomRange));
                    if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && isPreset) {
                        this.setScrollPosition();
                    }
                }
            }
        }
    }

    /**
     * To close the Popup container in the DateRangePicker component.
     * @returns void
     */
    public hide(event?: KeyboardEventArgs | MouseEvent | Event): void {
        if (this.popupObj) {
            if (isNullOrUndefined(this.previousEndValue) && isNullOrUndefined(this.previousStartValue)) {
                this.clearRange();
            } else {
                if (!isNullOrUndefined(this.previousStartValue)) {
                    this.startValue = new Date('' + this.previousStartValue);
                    this.setValue();
                    this.currentDate = new Date('' + this.startValue);
                } else {
                    this.startValue = null;
                    this.setValue();
                }
                if (!isNullOrUndefined(this.previousEndValue)) {
                    this.endValue = new Date('' + this.previousEndValue);
                    this.setValue();
                } else {
                    this.endValue = null;
                    this.setValue();
                }
            }
            if (this.isPopupOpen()) {
                this.closeEventArgs = {
                    cancel: false,
                    popup: this.popupObj,
                    date: this.inputElement.value,
                    model: this,
                    event: event ? event : null
                };
                this.trigger('close', this.closeEventArgs);
                if (!this.closeEventArgs.cancel) {
                    if (this.isMobile) {
                        if (!isNullOrUndefined(this.startButton) && !isNullOrUndefined(this.endButton)) {
                            EventHandler.remove(this.startButton.element, 'click touchstart', this.deviceHeaderClick);
                            EventHandler.remove(this.endButton.element, 'click touchstart', this.deviceHeaderClick);
                        }
                    }
                    if (this.popupObj) {
                        this.popupObj.hide();
                        if (this.preventBlur) {
                            this.inputElement.focus();
                            addClass([this.inputWrapper.container], [INPUTFOCUS]);
                        }
                    }
                    if (!this.isMobile) {
                        if (!isNullOrUndefined(this.leftKeyboardModule) && !isNullOrUndefined(this.rightKeyboardModule)) {
                            this.leftKeyboardModule.destroy();
                            this.rightKeyboardModule.destroy();
                        }
                        if (!isNullOrUndefined(this.presetElement)) {
                            this.presetKeyboardModule.destroy();
                        }
                        if (!isNullOrUndefined(this.cancelButton)) {
                            this.btnKeyboardModule.destroy();
                        }
                    }
                    this.targetElement = null;
                    removeClass([document.body], OVERFLOW);
                    EventHandler.remove(document, 'mousedown touchstart', this.documentHandler);
                    if (this.isMobile && this.modal) {
                        this.modal.style.display = 'none';
                        this.modal.outerHTML = '';
                        this.modal = null;
                    }
                    this.isKeyPopup = this.dateDisabled = false;
                } else {
                    removeClass([this.inputWrapper.buttons[0]], ACTIVE);
                }
            }
        }
        this.updateHiddenInput();
        if (this.isMobile) {
            this.element.removeAttribute('readonly');
        }
    }
    private setLocale(): void {
        this.globalize = new Internationalization(this.locale);
        this.l10n.setLocale(this.locale);
        this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
        Input.setPlaceholder(this.placeholder, this.inputElement);
        this.updateInput();
        this.changeTrigger();
    }
    private refreshChange(): void {
        this.refreshControl();
        this.changeTrigger();
    }
    private setDate(): void {
        Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        this.refreshChange();
    }
    private enableInput(): void {
        if (+ this.min <= +this.max) {
            this.setProperties({ enabled: true }, true);
            Input.setEnabled(this.enabled, this.inputElement);
            if (this.element.hasAttribute('disabled')) {
                this.bindEvents();
            }
        }
    }
    private clearModelvalue(newProp: DateRangePickerModel, oldProp: DateRangePickerModel): void {
        this.setProperties({ startDate: null }, true);
        this.setProperties({ endDate: null }, true);
        if (oldProp.value && (<Date[]>oldProp.value).length > 0) {
            this.setProperties({ value: null }, true);
        } else if (oldProp.value && (<DateRange>oldProp.value).start) {
            this.setProperties({ value: { start: null, end: null } }, true);
        } else if (oldProp.value && !(<DateRange>oldProp.value).start) {
            this.setProperties({ value: { start: null, end: null } }, true);
        }
        this.updateValue();
        this.setDate();
    }
    private createHiddenInput(): void {
        if (isNullOrUndefined(this.firstHiddenChild) && isNullOrUndefined(this.secondHiddenChild)) {
            this.firstHiddenChild = <HTMLInputElement>this.createElement('input');
            this.secondHiddenChild = <HTMLInputElement>this.createElement('input');
        }
        if (!isNullOrUndefined(this.inputElement.getAttribute('name'))) {
            this.inputElement.setAttribute('data-name', this.inputElement.getAttribute('name'));
            this.inputElement.removeAttribute('name');
        }
        attributes(this.firstHiddenChild, {
            'type': 'text', 'name': this.inputElement.getAttribute('data-name')
        });
        attributes(this.secondHiddenChild, {
            'type': 'text', 'name': this.inputElement.getAttribute('data-name'),
        });
        let format: Object = { type: 'datetime', skeleton: 'yMd' };
        this.firstHiddenChild.value = this.startDate && this.globalize.formatDate(this.startDate, format);
        this.secondHiddenChild.value = this.endDate && this.globalize.formatDate(this.endDate, format);
        this.inputElement.parentElement.appendChild(this.firstHiddenChild);
        this.inputElement.parentElement.appendChild(this.secondHiddenChild);
        this.firstHiddenChild.style.display = 'none';
        this.secondHiddenChild.style.display = 'none';
    }
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    public onPropertyChanged(newProp: DateRangePickerModel, oldProp: DateRangePickerModel): void {
        let format: Object = { format: this.format, type: 'date', skeleton: 'yMd' };
        for (let prop of Object.keys(newProp)) {
            this.hide(null);
            switch (prop) {
                case 'width':
                    this.setEleWidth(this.width);
                    break;
                case 'separator':
                    this.previousEleValue = this.inputElement.value;
                    this.setProperties({ separator: newProp.separator }, true);
                    this.updateInput();
                    this.changeTrigger();
                    break;
                case 'placeholder':
                    Input.setPlaceholder(newProp.placeholder, this.inputElement);
                    this.setProperties({ placeholder: newProp.placeholder }, true);
                    break;
                case 'readonly':
                    Input.setReadonly(this.readonly, this.inputElement);
                    this.inputElement.setAttribute('aria-readonly', '' + this.readonly);
                    break;
                case 'cssClass':
                    if (this.popupWrapper) { this.popupWrapper.className += ' ' + newProp.cssClass; }
                    this.inputWrapper.container.className += ' ' + newProp.cssClass;
                    this.setProperties({ cssClass: newProp.cssClass }, true);
                    break;
                case 'enabled':
                    this.setProperties({ enabled: newProp.enabled }, true);
                    Input.setEnabled(this.enabled, this.inputElement);
                    this.bindEvents();
                    break;
                case 'allowEdit':
                    this.setRangeAllowEdit();
                    break;
                case 'enableRtl':
                    this.setProperties({ enableRtl: newProp.enableRtl }, true);
                    Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
                    break;
                case 'zIndex':
                    this.setProperties({ zIndex: newProp.zIndex }, true);
                    break;
                case 'format':
                    this.setProperties({ format: newProp.format }, true);
                    this.updateInput();
                    this.changeTrigger();
                    break;
                case 'locale':
                    this.globalize = new Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                    Input.setPlaceholder(this.placeholder, this.inputElement);
                    this.setLocale();
                    break;
                case 'showClearButton':
                    Input.setClearButton(this.showClearButton, this.inputElement, this.inputWrapper);
                    this.bindClearEvent();
                    break;
                case 'startDate':
                    if (typeof newProp.startDate === 'string') {
                        newProp.startDate = this.globalize.parseDate(<string>newProp.startDate, format);
                    }
                    if (+this.initStartDate !== +newProp.startDate) {
                        this.startValue = this.checkDateValue(new Date('' + newProp.startDate));
                        this.setDate();
                        this.setValue();
                    }
                    break;
                case 'endDate':
                    if (typeof newProp.endDate === 'string') {
                        newProp.endDate = this.globalize.parseDate(<string>newProp.endDate, format);
                    }
                    if (+this.initEndDate !== +newProp.endDate) {
                        this.endValue = this.checkDateValue(new Date('' + newProp.endDate));
                        this.setDate();
                        this.setValue();
                    }
                    break;
                case 'value':
                    if ((!isNullOrUndefined(newProp.value) && (<Date[]>newProp.value).length > 0)
                        || !isNullOrUndefined(newProp.value) && (<DateRange>newProp.value).start) {
                        this.valueType = newProp.value;
                        if ((<Date[]>newProp.value)[0] === null || ((<DateRange>newProp.value).start === null)) {
                            if ((<Date[]>newProp.value).length === 1 || ((<DateRange>newProp.value).start)) {
                                this.clearModelvalue(newProp, oldProp);
                            } else if ((<Date[]>newProp.value)[1] === null ||
                                ((<DateRange>newProp.value).start === null)) { this.clearModelvalue(newProp, oldProp); }
                        } else if ((+this.initStartDate !== +(<Date[]>newProp.value)[0]
                            || +this.initEndDate !== +(<Date[]>newProp.value)[1]) ||
                            (+this.initStartDate !== +((<DateRange>newProp.value).start
                                || +this.initEndDate !== +(<DateRange>newProp.value).start))) {
                            if ((<Date[]>newProp.value).length === 1) {
                                this.modelValue = <Date[]>newProp.value;
                            } else if ((<DateRange>newProp.value).start) {
                                this.modelValue = <DateRange>newProp.value;
                            }
                            this.updateValue();
                            this.setDate();
                        }
                    } else {
                        if (isNullOrUndefined(this.value)
                            || (<DateRange>newProp.value).start == null) {
                            this.valueType = newProp.value;
                            this.startValue = null;
                            this.endValue = null;
                            this.clearModelvalue(newProp, oldProp);
                        }
                    }
                    break;
                case 'minDays':
                    this.setProperties({ minDays: newProp.minDays }, true);
                    this.refreshChange();
                    break;
                case 'maxDays':
                    this.setProperties({ maxDays: newProp.maxDays }, true);
                    this.refreshChange();
                    break;
                case 'min':
                    this.setProperties({ min: this.checkDateValue(new Date('' + newProp.min)) }, true);
                    this.previousEleValue = this.inputElement.value;
                    this.enableInput();
                    this.refreshChange();
                    break;
                case 'max':
                    this.setProperties({ max: this.checkDateValue(new Date('' + newProp.max)) }, true);
                    this.enableInput();
                    this.refreshChange();
                    break;
                case 'strictMode':
                    this.setProperties({ strictMode: newProp.strictMode }, true);
                    this.refreshChange();
                    break;
                case 'presets':
                    this.setProperties({ presets: newProp.presets }, true);
                    this.processPresets();
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                    break;
            }
        }
    }
}
