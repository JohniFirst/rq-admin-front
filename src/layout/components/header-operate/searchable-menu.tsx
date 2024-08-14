import { useEffect, useMemo, useRef, useState } from "react";
import { Input, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/store/hooks";
import system from "./css/system.module.css";
import type { ChangeEvent, FC } from "react";
import type { InputRef } from "antd";
import useCustomNavigate from "@/hooks/useCustomNavigate";

const SearchableMenu: FC = () => {
  const [searchText, setSearchText] = useState("");
  const menuItems = useAppSelector((state) => state.menu.menu);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const navigate = useCustomNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "m") {
        setIsModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const findMatchingItems = (arr: MenuItem[], keyword: string): MenuItem[] => {
    if (keyword === "") {
      return [];
    }

    function checkLabel(arr: MenuItem[]) {
      const tempResult: MenuItem[] = [];
      arr.forEach((item) => {
        if (item.children) {
          const childrenLableIncludesKeyword = checkLabel(item.children);
          if (childrenLableIncludesKeyword.length) {
            tempResult.push({
              ...item,
              children: childrenLableIncludesKeyword,
            });
          }
        } else {
          if (item.label.includes(keyword)) {
            tempResult.push(item);
          }
        }
      });

      return tempResult;
    }

    return checkLabel(arr);
  };

  const filterNav = (key: string) => {
    setIsModalOpen(false);
    navigate(key);
  };

  const FilterResultItem = (item: MenuItem) => {
    if (item.children) {
      return (
        <div key={item.key} className={system.filterMenuWp}>
          <p>{item.label}</p>
          {item.children.map((child: MenuItem) => FilterResultItem(child))}
        </div>
      );
    }
    return (
      <p
        key={item.key}
        className={system.filterMenuItem}
        onClick={() => filterNav(item.key)}
      >
        {item.label.split("").map((labelItem: string) => {
          return (
            <span
              key={labelItem}
              style={{ color: searchText.includes(labelItem) ? "red" : "" }}
            >
              {labelItem}
            </span>
          );
        })}
      </p>
    );
  };

  const content = useMemo(() => {
    return (
      <div className="relative left-[-1.75rem] mt-2">
        {findMatchingItems(menuItems, searchText).map((item) => {
          return FilterResultItem(item);
        })}
      </div>
    );
  }, [searchText]);

  return (
    <>
      <Input
        prefix={<SearchOutlined />}
        onFocus={() => setIsModalOpen(true)}
        placeholder="输入菜单名"
      />

      <Modal
        open={isModalOpen}
        closeIcon={null}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        focusTriggerAfterClose={false}
        wrapClassName="max-h-[500px]"
        afterOpenChange={(open) => {
          if (open) {
            inputRef.current!.focus({
              cursor: "all",
            });
          }
        }}
      >
        <Input
          ref={inputRef}
          prefix={<SearchOutlined />}
          onChange={handleSearchChange}
          placeholder="输入菜单名"
        />
        {content}
      </Modal>
    </>
  );
};

export default SearchableMenu;
