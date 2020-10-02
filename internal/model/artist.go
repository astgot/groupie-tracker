package model

// Artist ...
type Artist struct {
	ID           int      `json:"id"`
	Image        string   `json:"image"`
	Name         string   `json:"name"`
	Members      []string `json:"members"`
	CreationDate int      `json:"creationDate"`
	FirstAlbum   string   `json:"firstAlbum"`
	RelationURL  string   `json:"relations"`
	Relations    *Relation
}

// Artists ...
type Artists []Artist
