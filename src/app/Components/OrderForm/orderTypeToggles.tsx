import { BuyButton } from "./buyButton";
import { OrderTypeButton } from "./orderTypeButton";
import { SellButton } from "./sellButton";
type OrderTypeTogglesProps = {
  handleBuyButtonClick: () => void;
  handleSellButtonClick: () => void;
  handleMarketToggle: () => void;
  handleLimitToggle: () => void;
  orderType: string;
  isSelected: string;
};

export function OrderTypeToggles({
  handleBuyButtonClick,
  handleSellButtonClick,
  handleMarketToggle,
  handleLimitToggle,
  orderType,
  isSelected,
}: OrderTypeTogglesProps) {
  return (
    <div className="flex flex-col gap-6 mb-6">
      <div className="flex w-full gap-2">
        <BuyButton
          handleBuyButtonClick={handleBuyButtonClick}
          isSelected={isSelected}
        />
        <SellButton
          handleSellButtonClick={handleSellButtonClick}
          isSelected={isSelected}
        />
      </div>
      <div className="flex w-full justify-center gap-4">
        <OrderTypeButton
          toggleOrderType={handleMarketToggle}
          orderType={orderType}
          type="market"
        />
        <OrderTypeButton
          toggleOrderType={handleLimitToggle}
          orderType={orderType}
          type="limit"
        />
      </div>
    </div>
  );
}
