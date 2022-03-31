import React, { Component } from "react";
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Combobox } from '@headlessui/react'

class ComboBoxComponent extends Component {
    constructor(props) {
        super();

        this.props = props;
        this.state = {
            active: [],
            selectedElement: this.props.elements[0],
            filtered: this.props.elements,
            query: 'All'
        }
    }

    setSelectedElement = (selectedElement) => {
        // If we don't have multiselect turned on then just select the element passed in
        if (!this.props.multiSelect) {
            this.setState({ selectedElement: selectedElement })
            return
        }

        if (selectedElement.name === "All") {
            // If we select All then we want to query for all elements in the combobox, for this case an empty selection means we should send * to the query on the API
            this.setState({ selectedElement: selectedElement })
            this.setState({ active: [] })
        }
        else if (this.state.active.map(e => e.id).includes(selectedElement.id)) {
            // Remove an element after selecting it again, this is buggy - sorry!
            this.setState({ active: this.state.active.filter((e) => e.id !== selectedElement.id) })
        } else {
            // Else we add the current selection to a list of 'active' selections
            this.state.active.push(selectedElement)
            this.setState({ active: this.state.active })
        }

        // When we only have a single selection that isn't 'All', we can display this name
        if (this.state.active.length === 1) {
            this.setState({ selectedElement: selectedElement })
        } else {
            // But if we have multiple it won't display nicely, so just show "Multiple"
            // TODO: Decide if there is a nicer way to do this
            this.setState({ selectedElement: { id: "Multiple", name: "Multiple" } })
            // this.setState({ selectedElement: { id: this.state.active.map(e => e.name).toString(), name: this.state.active.map(e => e.name).toString() } })
        }
        this.props.notifyComboBoxChanged(this.state.active);
    }

    resetSelection = () => {
        this.setState({ filtered: this.props.elements })
    }

    setQuery = (query) => {
        console.log(`query: ${query}`)
        if (query.length > 0) {
            this.setState({ query: query })
            this.setState({ filtered: this.state.filtered.filter((e) => e.name.includes(query)) })
        } else {
            this.resetSelection();
        }
    }

    classNames = (...classes) => {
        return classes.filter(Boolean).join(' ')
    }

    render() {
        return (
            <Combobox className="grow p-2" as="div" value={this.state.selectedElement} onChange={this.setSelectedElement}>
                <Combobox.Label className="block text-sm font-medium text-gray-700">{this.props.title}</Combobox.Label>
                <div className="relative mt-1">
                    <Combobox.Input
                        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        onChange={(event) => {
                            this.setQuery(event.target.value)
                        }}
                        displayValue={(person) => person.name}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                        <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Combobox.Button>

                    {this.state.filtered.length > 0 && (
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {this.state.filtered.map((element) => (
                                <Combobox.Option
                                    key={element.id}
                                    value={element}
                                    className={({ active }) =>
                                        this.classNames(
                                            'relative cursor-default select-none py-2 pl-3 pr-9',
                                            active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                        )
                                    }
                                >
                                    {({ active, selected }) => (
                                        <>
                                            <span className={this.classNames('block truncate', selected && 'font-semibold')}>{element.name}</span>
                                            {this.state.active.map(e => e.name).includes(element.name) &&
                                                <span
                                                    className={this.classNames(
                                                        'absolute inset-y-0 right-0 flex items-center pr-4',
                                                        active ? 'text-white' : 'text-indigo-600'
                                                    )}
                                                >
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>}
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