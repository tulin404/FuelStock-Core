ALTER TABLE stocks
ADD CONSTRAINT stocks_current_stock_non_negative
CHECK (current_stock >= 0);