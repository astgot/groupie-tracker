package main

import (
	"fmt"
	"net/http"

	controller "../../internal/controller"
)

func main() {
	mux := http.NewServeMux()
	fs := http.FileServer(http.Dir("web/css"))
	js := http.FileServer(http.Dir("web/js"))
	mux.Handle("/js/", http.StripPrefix("/js/", js))
	mux.Handle("/css/", http.StripPrefix("/css/", fs))
	mux.HandleFunc("/", controller.MainHandle)
	mux.HandleFunc("/artist", controller.ArtistHandle)
	mux.HandleFunc("/search", controller.SearchHandler)
	fmt.Println("REST API is working on 8080 port")
	http.ListenAndServe(":8080", mux)
}
