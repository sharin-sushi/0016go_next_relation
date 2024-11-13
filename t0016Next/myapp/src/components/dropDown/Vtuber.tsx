import React from "react";
import Select from "react-select";

import type { BasicDataProps, ReceivedVtuber } from "@/types/vtuber_content";
import { DropStyle } from "./common";

type DropDownVtuberProps = {
  posts: BasicDataProps;
  onVtuberSelect: (value: number) => void;
  defaultMenuIsOpen: boolean;
};

type vtuberListsProps = {
  value: number;
  label: string;
};

const composeVtuberOptions = (posts: ReceivedVtuber[]): vtuberListsProps[] => {
  try {
    const vtuberLists = posts.map((vtuber: ReceivedVtuber) => ({
      value: vtuber.VtuberId,
      label: vtuber.VtuberName,
    }));
    return vtuberLists;
  } catch (error) {
    console.error("Error in vtuberLists:", error);
    return [];
  }
};

export const DropDownVtuber = ({
  posts,
  onVtuberSelect,
  defaultMenuIsOpen,
}: DropDownVtuberProps) => {
  const vtubers = posts?.vtubers || [{} as ReceivedVtuber];
  const vtuberOptions = composeVtuberOptions(vtubers);

  return (
    <Select
      id="selectbox"
      instanceId="selectbox"
      placeholder="Vtuberを検索/選択"
      className="basic-single"
      classNamePrefix="select"
      isClearable={true}
      isSearchable={true}
      name="VTuber"
      options={vtuberOptions}
      defaultMenuIsOpen={defaultMenuIsOpen}
      blurInputOnSelect={true}
      styles={DropStyle}
      onChange={(option) => {
        if (option) {
          onVtuberSelect(option.value);
        } else {
          onVtuberSelect(0);
        }
      }}
    />
  );
};
