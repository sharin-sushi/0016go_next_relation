import React from "react";
import Select from "react-select";

import type { BasicDataProps, ReceivedVtuber } from "@/types/vtuber_content";
import { DropStyle } from "./common";

type vtuberListsProps = {
  value: number;
  label: string;
};

type DropDownVtuberProps = {
  posts: BasicDataProps;
  selectedVtuber: ReceivedVtuber | undefined;
  onVtuberSelect: (vtuberId: number) => void;
  defaultMenuIsOpen: boolean;
};

export const DropDownVtuber = ({
  posts,
  selectedVtuber,
  onVtuberSelect,
  defaultMenuIsOpen,
}: DropDownVtuberProps) => {
  const vtubers = posts?.vtubers || [{} as ReceivedVtuber];
  const vtuberOptions = makeVtuberOptions(vtubers);

  const onChange = (option: vtuberListsProps | null) => {
    if (option) {
      onVtuberSelect(option.value);
    } else {
      onVtuberSelect(0);
    }
  };

  if (selectedVtuber == null) {
    return (
      <Select
        id="selectbox"
        instanceId="selectbox"
        placeholder="VTuberを検索/選択"
        className="basic-single"
        classNamePrefix="select"
        isClearable
        isSearchable
        name="VTuber"
        options={vtuberOptions}
        defaultMenuIsOpen={defaultMenuIsOpen}
        blurInputOnSelect
        styles={DropStyle}
        onChange={onChange}
      />
    );
  }

  return (
    <Select
      defaultValue={makeVtuberOption(selectedVtuber)}
      id="selectbox"
      instanceId="selectbox"
      placeholder="VTuberを検索/選択"
      className="basic-single"
      classNamePrefix="select"
      isClearable
      isSearchable
      name="VTuber"
      options={vtuberOptions}
      defaultMenuIsOpen={defaultMenuIsOpen}
      blurInputOnSelect
      styles={DropStyle}
      onChange={onChange}
    />
  );
};

const makeVtuberOptions = (posts: ReceivedVtuber[]): vtuberListsProps[] => {
  return posts.map((vtuber: ReceivedVtuber) => makeVtuberOption(vtuber));
};

const makeVtuberOption = (vtuber: ReceivedVtuber): vtuberListsProps => {
  return {
    value: vtuber.VtuberId,
    label: vtuber.VtuberName,
  };
};
