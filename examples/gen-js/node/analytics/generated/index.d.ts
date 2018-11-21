export interface Message {
  type: string;
  context: {
    library: {
      name: string;
      version: string;
    };
    [key: string]: any;
  };
  _metadata: {
    nodeVersion: string;
    [key: string]: any;
  };
  timestamp?: Date;
  messageId?: string;
  anonymousId: string | number;
  userId: string | number;
}

export interface Data {
  batch: Message[];
  timestamp: Date;
  sentAt: Date;
}

export type AnalyticsNodeCallback = (err: Error, data: Data) => void;

export interface TrackMessage<PropertiesType> {
  /** The ID for this user in your database. */
  userId: string | number;
  /** An ID to associated with the user when you don’t know who they are. */
  anonymousId?: string | number;
  /** A dictionary of properties for the event. */
  properties?: PropertiesType;
  /**
   * A Javascript date object representing when the track took place.
   * If the track just happened, leave it out and we’ll use the server’s
   * time. If you’re importing data from the past make sure you to send
   * a timestamp.
   */
  timestamp?: Date;
  /**
   * A dictionary of extra context to attach to the call.
   * https://segment.com/docs/spec/common/#context
   */
  context?: Object;
}

export interface OrderCompleted {
  /**
   * Store or affiliation from which this transaction occurred (e.g. Google Store)
   */
  affiliation?: string;
  /**
   * Checkout ID
   */
  checkout_id?: string;
  /**
   * Transaction coupon redeemed with the transaction
   */
  coupon?: string;
  /**
   * Currency code associated with the transaction
   */
  currency?: string;
  /**
   * Total discount associated with the transaction
   */
  discount?: number;
  /**
   * Order/transaction ID
   */
  order_id: string;
  /**
   * Products in the order
   */
  products?: Product[];
  /**
   * Revenue associated with the transaction (excluding shipping and tax)
   */
  revenue?: number;
  /**
   * Shipping cost associated with the transaction
   */
  shipping?: number;
  /**
   * Total tax associated with the transaction
   */
  tax?: number;
  /**
   * Revenue with discounts and coupons added in. Note that our Google Analytics Ecommerce
   * destination accepts total or revenue, but not both. For better flexibility and total
   * control over tracking, we let you decide how to calculate how coupons and discounts are
   * applied
   */
  total?: number;
}

export interface Product {
  /**
   * Brand associated with the product
   */
  brand?: string;
  /**
   * Product category being viewed
   */
  category?: string;
  /**
   * Coupon code associated with a product (e.g MAY_DEALS_3)
   */
  coupon?: string;
  /**
   * Image url of the product
   */
  image_url?: string;
  /**
   * Name of the product being viewed
   */
  name?: string;
  /**
   * Position in the product list (ex. 3)
   */
  position?: number;
  /**
   * Price of the product being viewed
   */
  price?: number;
  /**
   * Database id of the product being viewed
   */
  product_id?: string;
  /**
   * Quantity of a product
   */
  quantity?: number;
  /**
   * Sku of the product being viewed
   */
  sku?: string;
  /**
   * URL of the product page
   */
  url?: string;
  /**
   * Variant of the product (e.g. Black)
   */
  variant?: string;
}

/**
 * Analytics provides a strongly-typed wrapper around Segment Analytics
 * based on your Tracking Plan.
 */
export default class Analytics {
  constructor(analytics: any);

  orderCompleted(
    message: TrackMessage<OrderCompleted>,
    callback?: AnalyticsNodeCallback
  ): void;
}
