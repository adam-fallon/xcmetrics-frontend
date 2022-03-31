import React, { Component } from "react";
import { useState } from 'react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Combobox } from '@headlessui/react'

class ComboBoxComponent extends Component {
    constructor(props) {
        super();

        this.props = props;
        this.state = {
            selectedElement: this.props.elements[0],
            filtered: this.props.elements
        }
    }

    setSelectedElement = (selectedElement) => {
        this.setState({ selectedPerson: selectedElement })
        this.props.notifyComboBoxChanged(selectedElement);
    }

    setQuery = (query) => {
    }

    classNames = (...classes) => {
        return classes.filter(Boolean).join(' ')
    }

    render() {
        return (
            <Combobox className="px-2" as="div" value={this.state.selectedElement} onChange={this.setSelectedElement}>
                <Combobox.Label className="block text-sm font-medium text-gray-700">{this.props.title}</Combobox.Label>
                <div className="relative mt-1">
                    <Combobox.Input
                        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        onChange={(event) => this.setQuery(event.target.value)}
                        displayValue={(person) => person.name}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                        <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Combobox.Button>

                    {this.state.filtered.length > 0 && (
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {this.state.filtered.map((person) => (
                                <Combobox.Option
                                    key={person.id}
                                    value={person}
                                    className={({ active }) =>
                                        this.classNames(
                                            'relative cursor-default select-none py-2 pl-3 pr-9',
                                            active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                        )
                                    }
                                >
                                    {({ active, selected }) => (
                                        <>
                                            <span className={this.classNames('block truncate', selected && 'font-semibold')}>{person.name}</span>

                                            {selected && (
                                                <span
                                                    className={this.classNames(
                                                        'absolute inset-y-0 right-0 flex items-center pr-4',
                                                        active ? 'text-white' : 'text-indigo-600'
                                                    )}
                                                >
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    )}
                </div>
            </Combobox>
        )
    }
}

export default ComboBoxComponent;