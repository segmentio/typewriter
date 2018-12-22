type EmptyEvent map[string]interface{}

type The42_TerribleEventName3 struct {
    The0000TerriblePropertyName3 interface{} `json:"0000---terrible-property-name~!3"`// Really, don't do this.
    IdentifierID                 interface{} `json:"identifier_id"`                   // AcronymStyle bug fixed in v5.0.1
}

type ExampleEvent struct {
    OptionalAny         interface{}            `json:"optional any"`                     // Optional any property
    OptionalArray       []OptionalArray        `json:"optional array"`                   // Optional array property
    OptionalArrayEmpty  []interface{}          `json:"optional array (empty)"`           // Optional array (empty) property
    OptionalBoolean     *bool                  `json:"optional boolean,omitempty"`       // Optional boolean property
    OptionalInt         *int64                 `json:"optional int,omitempty"`           // Optional integer property
    OptionalNumber      *float64               `json:"optional number,omitempty"`        // Optional number property
    OptionalObject      *OptionalObject        `json:"optional object,omitempty"`        // Optional object property
    OptionalObjectEmpty map[string]interface{} `json:"optional object (empty),omitempty"`// Optional object (empty) property
    OptionalString      *string                `json:"optional string,omitempty"`        // Optional string property
    OptionalStringRegex *string                `json:"optional string regex,omitempty"`  // Optional string regex property
    RequiredAny         interface{}            `json:"required any"`                     // Required any property
    RequiredArray       []RequiredArray        `json:"required array"`                   // Required array property
    RequiredArrayEmpty  []interface{}          `json:"required array (empty)"`           // Required array (empty) property
    RequiredBoolean     bool                   `json:"required boolean"`                 // Required boolean property
    RequiredInt         int64                  `json:"required int"`                     // Required integer property
    RequiredNumber      float64                `json:"required number"`                  // Required number property
    RequiredObject      RequiredObject         `json:"required object"`                  // Required object property
    RequiredObjectEmpty map[string]interface{} `json:"required object (empty)"`          // Required object (empty) property
    RequiredString      string                 `json:"required string"`                  // Required string property
    RequiredStringRegex string                 `json:"required string regex"`            // Required string regex property
}

type OptionalArray struct {
    OptionalSubProperty *string `json:"optional sub-property,omitempty"`// Optional sub-property
    RequiredSubProperty string  `json:"required sub-property"`          // Required sub-property
}

// Optional object property
type OptionalObject struct {
    OptionalSubProperty *string `json:"optional sub-property,omitempty"`// Optional sub-property
    RequiredSubProperty string  `json:"required sub-property"`          // Required sub-property
}

type RequiredArray struct {
    OptionalSubProperty *string `json:"optional sub-property,omitempty"`// Optional sub-property
    RequiredSubProperty string  `json:"required sub-property"`          // Required sub-property
}

// Required object property
type RequiredObject struct {
    OptionalSubProperty *string `json:"optional sub-property,omitempty"`// Optional sub-property
    RequiredSubProperty string  `json:"required sub-property"`          // Required sub-property
}
