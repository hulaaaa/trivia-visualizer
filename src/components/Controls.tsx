import React from 'react';
import Button from "@jetbrains/ring-ui-built/components/button/button";
import Text from "@jetbrains/ring-ui-built/components/text/text";
import Select, {type SelectItem, type SelectProps} from "@jetbrains/ring-ui-built/components/select/select";

export interface RingUISelectData {
    key: string;
    label: string;
}

interface ControlsProps {
    categories: string[];
    selectedCategory: string | null;
    onSelectCategory: (cat: string | null) => void;
    onReset: () => void;
    totalCount: number;
    filteredCount: number;
}

const toSelectData = (cats: string[], placeholder: string): RingUISelectData[] => {
    const data: RingUISelectData[] = [{key: '', label: placeholder}];
    cats.forEach(c => data.push({key: c, label: c}));
    return data;
};

type CategorySelectProps = SelectProps<RingUISelectData>;
const TypedSelect = Select as unknown as React.FC<CategorySelectProps>;


const Controls: React.FC<ControlsProps> = ({categories, selectedCategory, onSelectCategory, onReset, totalCount, filteredCount}) => {
    const placeholderLabel = "All categories";
    const selectData = toSelectData(categories, placeholderLabel);
    const selectedItem: SelectItem<RingUISelectData> | null = selectedCategory
        ? {key: selectedCategory, label: selectedCategory}
        : null;

    const handleSelectChange: CategorySelectProps['onChange'] = (selected: SelectItem<RingUISelectData> | null) => {
        const selectedKey = selected ? selected.key : null;
        onSelectCategory(selectedKey === '' ? null : selectedKey);
    };

    return (
        <div className="controls" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc'}}>
            <div className="controls__left" style={{display: 'flex', alignItems: 'center'}}>
                <div className="controls__dropdown" style={{minWidth: '240px'}}>
                    <TypedSelect
                        data={selectData}
                        selected={selectedItem}
                        onChange={handleSelectChange}
                        label="Select category"
                    />
                </div>

                <Button
                    onClick={onReset}
                    danger={true}
                    style={{marginLeft: 8}}
                >
                    Reset
                </Button>
            </div>

            <div className="controls__meta" style={{display: 'flex', gap: '20px', fontSize: '0.9em', color: '#555'}}>
                <Text>Total: {totalCount}</Text>
                <Text>Show: {filteredCount}</Text>
            </div>
        </div>
    );
};

export default Controls;