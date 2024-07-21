/**
 * @class BaseFormatter
 *
 * @description
 * An abstract class that provides a base for creating formatter classes. These formatter classes are used to format data
 * from one type to another. The class uses a format function passed to it during instantiation and provides methods to
 * format a single data item or an array of data items.
 *
 * @public
 *
 * @template E - The type of the input data that needs to be formatted.
 * @template D - The type of the output data after formatting.
 */
export abstract class BaseFormatter<E, D> {
  /**
   * @constructor
   *
   * @param { (data: E) => D } format - A function that takes data of type E and returns data of type D.
   */
  protected constructor(private readonly format: (data: E) => D) {}

  /**
   * @method formatOne
   *
   * @description
   * Formats a single data item from type E to type D using the format function provided during instantiation.
   *
   * @param {E} data - The data item of type E that needs to be formatted.
   *
   * @returns {D} - The formatted data item of type D.
   */
  readonly formatOne = (data: E): D => {
    return this.format(data);
  };

  /**
   * @method formatAll
   *
   * @description
   * Formats an array of data items from type E to type D using the format function provided during instantiation. This
   * is done by mapping over the array and applying the format function to each data item.
   *
   * @param {E[]} data - The array of data items of type E that need to be formatted.
   *
   * @returns {D[]} - The array of formatted data items of type D.
   */
  readonly formatAll = (data: E[]): D[] => {
    return data.map(this.format);
  };
}
